---
title: "Building REST APIs with WebFiori v3"
date: 2026-06-24
summary: "One annotated class gives you routing, validation, and OpenAPI docs. No config files."
tags: [web-services, openapi, rest, validation]
example: https://github.com/webfiori/webfiori-examples/tree/main/blog-examples/01-web-services
---

# Building REST APIs with WebFiori v3

Most PHP frameworks separate route definitions, validation rules, and API documentation into different files. WebFiori v3 consolidates them: everything lives on the class itself using PHP 8.1 attributes.

## The Problem

A typical REST endpoint involves:

1. A route definition file
2. A controller class
3. A separate request validation class
4. Manual OpenAPI/Swagger annotations (if you want docs)

Four places to maintain for a single endpoint. When requirements change, developers update the controller but forget the validation rules or the docs. The contract drifts.

## The WebFiori Approach

In WebFiori v3, an endpoint is a single annotated class:

```php
namespace App\Apis;

use WebFiori\Http\Annotations\GetMapping;
use WebFiori\Http\Annotations\RequestParam;
use WebFiori\Http\Annotations\ResponseBody;
use WebFiori\Http\Annotations\RestController;
use WebFiori\Http\ParamType;
use WebFiori\Http\WebService;

#[RestController('products', 'Product API')]
class ProductService extends WebService {

    #[GetMapping]
    #[ResponseBody]
    #[RequestParam(name: 'id', type: ParamType::INT)]
    #[RequestParam(name: 'include_details', type: ParamType::BOOL, optional: true, default: false)]
    public function getProduct(): array {
        $id = $this->getParamVal('id');
        $includeDetails = $this->getParamVal('include_details');

        return [
            'product' => [
                'id' => $id,
                'name' => 'Sample Product',
                'details' => $includeDetails ? ['weight' => '1kg'] : null
            ]
        ];
    }
}
```

Place this class in `App/Apis` and the framework handles the rest. `ServiceRouter` auto-discovers it, registers the route, enforces the parameter types, and generates OpenAPI 3.1 documentation.

## Request Parameter Validation

Parameters are validated before your method executes. If a client sends `id=abc` when the type is `int`, the framework returns a `422` response with a clear error message. Your code never sees invalid data.

Supported types: `string`, `int`, `double`, `bool`, `email`, `url`, `array`.

```php
#[RequestParam(name: 'email', type: 'email')]
#[RequestParam(name: 'age', type: 'int', optional: true, default: 0)]
#[RequestParam(name: 'tags', type: 'array', optional: true)]
```

## Object Mapping

For POST/PUT endpoints with multiple fields, mapping parameters one by one becomes tedious. The `#[MapEntity]` attribute maps the entire request body to an object:

```php
use WebFiori\Http\Annotations\MapEntity;
use WebFiori\Http\Annotations\PostMapping;

#[PostMapping]
#[ResponseBody]
#[MapEntity(User::class)]
public function createUser(User $user): array {
    // $user is populated from the request body
    // {"name": "John", "email": "john@example.com"} → setName(), setEmail()

    $this->userRepo->save($user);
    return ['message' => 'User created', 'id' => $user->id];
}
```

The mapper matches request parameters to setter methods automatically: `name` → `setName()`, `email` → `setEmail()`.

## Cross-Field Validation

When individual parameter types are not enough, use `#[Validate]` for business rules that span multiple fields:

```php
use WebFiori\Http\Annotations\Validate;

#[PostMapping]
#[ResponseBody]
#[RequestParam(name: 'password', type: 'string')]
#[RequestParam(name: 'password_confirm', type: 'string')]
#[Validate('validatePasswords')]
public function register(): array {
    return ['message' => 'User registered'];
}

private function validatePasswords(array $inputs): array {
    $errors = [];
    if ($inputs['password'] !== $inputs['password_confirm']) {
        $errors['password_confirm'] = 'Passwords do not match.';
    }
    if (strlen($inputs['password']) < 8) {
        $errors['password'] = 'Password must be at least 8 characters.';
    }
    return $errors; // empty array = validation passed
}
```

If the method returns a non-empty array, the framework responds with `422` and the error messages. Your main method only executes when all validation passes.

## Auto-Discovery with ServiceRouter

No manual route registration needed. `ServiceRouter` scans your namespace, reads the annotations, and registers all routes at startup:

```php
// In App/Ini/Routes/ApiRoutes.php
use WebFiori\Framework\Router\ServiceRouter;
use WebFiori\Framework\Router\RouteOption;

class APIsRoutes {
    public static function create() {
        ServiceRouter::discover('App\\Apis', '/apis', [
            RouteOption::MIDDLEWARE => ['start-session', 'csrf']
        ]);
    }
}
```

This registers routes based on the `#[RestController]` name:
- `#[RestController('orders')]` → `/apis/orders`
- `#[RestController('products')]` → `/apis/products`

Recursive scanning discovers nested directories:

```php
ServiceRouter::discover('App\\Apis', '/apis', [], null, recursive: true);
// App/Apis/Admin/UserService.php → /apis/admin/user
// App/Apis/Auth/LoginService.php → /apis/auth/login
```

## OpenAPI Documentation

WebFiori generates OpenAPI 3.1 specs from your annotations. Create a dedicated endpoint to serve the spec:

```php
use WebFiori\Http\Annotations\AllowAnonymous;
use WebFiori\Http\Annotations\GetMapping;
use WebFiori\Http\Annotations\ResponseBody;
use WebFiori\Http\Annotations\RestController;
use WebFiori\Http\OpenAPI\OpenAPIGenerator;
use WebFiori\Http\WebService;
use WebFiori\Json\Json;

#[RestController('openapi', 'OpenAPI specification endpoint')]
class OpenAPIService extends WebService {

    #[GetMapping]
    #[ResponseBody]
    #[AllowAnonymous]
    public function getSpec(): Json {
        $generator = new OpenAPIGenerator();

        $spec = $generator->generate(
            [new ProductService(), new UserService()],
            'My API Description',
            '1.0.0',
            '/apis'
        );

        $spec->getInfo()->setTitle('My API');

        return $spec->toJSON();
    }
}
```

Access it at `GET /apis/openapi`. The spec includes all paths, parameters, types, required fields, and request body schemas — all derived from your `#[RequestParam]` annotations.

### Response Descriptions

Add response descriptions to make the generated docs more useful. Call `addResponse()` in the constructor to declare possible responses per HTTP method:

```php
#[RestController('products', 'Product management API')]
class ProductService extends WebService {

    public function __construct() {
        parent::__construct('products');

        $this->addResponse('GET', '200', 'List of products or a single product by ID')
             ->addResponse('GET', '404', 'Product not found')
             ->addResponse('POST', '200', 'Product created successfully')
             ->addResponse('DELETE', '404', 'Product not found');
    }
}
```

These descriptions appear in the generated OpenAPI spec under each operation's `responses` object, giving consumers clear expectations for each endpoint.

### Using with Swagger UI

Serve Swagger UI as a static HTML page that points to your spec endpoint:

```html
<!DOCTYPE html>
<html>
<head>
    <title>API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: '/apis/openapi',
            dom_id: '#swagger-ui'
        });
    </script>
</body>
</html>
```

You can also import the spec into:
- **Postman** — Import → OpenAPI → paste the URL
- **Stoplight, Redocly** — point to your `/apis/openapi` endpoint
- **CI/CD** — validate the spec with `swagger-cli validate` in your pipeline

## Testing

WebFiori provides `ServiceTestCase` for testing your services directly — no HTTP server, no manager class needed:

```php
use App\Apis\ProductService;
use WebFiori\Http\Test\ServiceTestCase;

class ProductServiceTest extends ServiceTestCase {

    public function testGetProduct() {
        $response = $this->get(new ProductService(), ['id' => 1]);
        $response->assertOk();

        $json = $response->getJson();
        $this->assertEquals(1, $json['data']['product']['id']);
    }

    public function testProductNotFound() {
        $this->get(new ProductService(), ['id' => 999])
            ->assertNotFound()
            ->assertError();
    }

    public function testCreateProduct() {
        $response = $this->post(new ProductService(), [
            'name' => 'Monitor',
            'category' => 'Electronics',
            'price' => 299.99
        ]);
        $response->assertOk();

        $json = $response->getJson();
        $this->assertEquals('Product created', $json['data']['message']);
    }

    public function testInvalidParamType() {
        $this->get(new ProductService(), ['id' => 'not-a-number'])
            ->assertError();
    }
}
```

Available methods: `get()`, `post()`, `put()`, `patch()`, `delete()` — each accepts a service instance, parameters, an optional authenticated user, and headers. The `TestResponse` object provides fluent assertions: `assertOk()`, `assertNotFound()`, `assertError()`, `assertJsonHas()`, `assertJsonEquals()`.

## Summary

WebFiori v3 eliminates the gap between route definition, validation, and documentation. One annotated class is your single source of truth. Changes to parameters are immediately reflected in validation behavior and API documentation.

For teams building enterprise APIs, this means fewer bugs from contract drift, faster onboarding for new developers, and less maintenance overhead.

---

**Resources:**
- [Web Services documentation](https://webfiori.com/docs/web-services)
- [Example app: Product & User API](https://github.com/webfiori/webfiori-examples/tree/main/blog-examples/01-web-services)
- [WebFiori on GitHub](https://github.com/WebFiori/framework)

---

Have feedback or questions? [Let me know](https://forms.gle/bdd6J7zfnwaMDgeU9) — takes 30 seconds.
