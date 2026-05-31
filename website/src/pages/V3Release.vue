<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import AuroraBackground from '../components/magic/AuroraBackground.vue'
import FadeIn from '../components/magic/FadeIn.vue'
import ShimmerBorder from '../components/magic/ShimmerBorder.vue'

const activeExample = ref(0)
const showMatrix = ref(false)

onMounted(() => {
  showMatrix.value = true
})

const codeExamples = [
  {
    label: 'Attribute-Based APIs',
    code: `#[RestController('orders', 'Order API')]
#[RequiresAuth]
class OrderService extends WebService {

    #[PostMapping]
    #[ResponseBody]
    #[PreAuthorize("hasAuthority('orders.create')")]
    #[RequestParam(name: 'items', type: ParamType::STRING)]
    public function createOrder(?string $items = null): array {
        $order = new Order(userId: $user->getId(), total: $total);
        $this->repo->save($order);

        EventDispatcherFacade::dispatch(new OrderPlacedEvent($order));

        return ['order' => $order];
    }
}`
  },
  {
    label: 'Job Queue + DI',
    code: `class ProcessPaymentJob implements Job {
    public function __construct(
        private int $orderId,
        private float $amount
    ) {}

    public function getMaxAttempts(): int { return 3; }
    public function getRetryDelaySeconds(): int { return 30; }

    public function handle(): void {
        $gateway = ContainerFacade::make(PaymentGatewayInterface::class);
        $result = $gateway->charge($this->amount);

        if (!$result['success']) {
            throw new \\RuntimeException($result['error']);
        }
    }
}

// Dispatch with priority and delay
QueueFacade::dispatch(new ProcessPaymentJob($id, 99.99), priority: 10);`
  },
  {
    label: 'ABAC Policies',
    code: `class OrderCancelPolicy {
    public function getPermission(): string {
        return 'orders.cancel';
    }

    public function evaluate($user, ?object $resource = null): bool {
        if ($resource->status !== 'pending') {
            return false;
        }

        if (in_array('admin', $user->getRoles())) {
            return true;
        }

        return $user->getId() === $resource->userId;
    }
}

// Registration
Access::role('customer', ['orders.create', 'orders.cancel']);
Access::registerPolicy(new OrderCancelPolicy());

// Evaluation: RBAC + ABAC in one call
Access::can($user, 'orders.cancel', $order);`
  },
  {
    label: 'Middleware Pipeline',
    code: `// Route with full middleware stack
Router::api([
    RouteOption::PATH => '/apis/{service}',
    RouteOption::TO => OrderServicesManager::class,
    RouteOption::MIDDLEWARE => [
        'maintenance-check',
        'start-session',
        'security-context',
        new CorsMiddleware([
            'origins' => ['https://app.example.com'],
            'credentials' => true,
        ]),
        new RateLimitMiddleware(maxRequests: 60, windowSeconds: 60),
        new HttpCacheMiddleware(['max-age' => 300, 'public' => true]),
    ]
]);`
  },
]

const whyV3 = [
  { icon: 'mdi-puzzle-outline', title: 'Monolithic Limitations', desc: 'v2 grew organically. Features were tightly coupled, making changes risky and testing difficult.' },
  { icon: 'mdi-scale-balance', title: 'Scaling Pain', desc: 'Real-world production use exposed bottlenecks in session handling, database abstraction, and request lifecycle.' },
  { icon: 'mdi-lightbulb-outline', title: 'Modern PHP', desc: 'PHP 8.1+ brought attributes, enums, fibers, and readonly properties. The architecture needed to embrace them natively.' },
  { icon: 'mdi-target', title: 'Redesign Goals', desc: 'Modularity. Testability. Zero magic. Every component is interface-driven, pluggable, and independently versioned.' },
]

const architecture = [
  { icon: 'mdi-view-module', title: 'Modularity', desc: '14 independent packages. Use what you need. Replace what you want. Each has its own release cycle.' },
  { icon: 'mdi-pipe', title: 'Middleware Pipeline', desc: 'Priority-based with dependency resolution. Before → Route → After → AfterSend. Topological sort ensures correct order.' },
  { icon: 'mdi-routes', title: 'Cleaner Routing', desc: 'Attribute-based controllers. No more manual route-to-method wiring. The framework discovers endpoints from annotations.' },
  { icon: 'mdi-puzzle', title: 'Extensibility', desc: 'Pluggable storage for sessions, cache, queues, and authorization. Implement the interface, swap the default.' },
  { icon: 'mdi-wrench', title: 'Maintainability', desc: 'Interface-driven design. No god classes. Each component has a single responsibility and clear boundaries.' },
  { icon: 'mdi-speedometer', title: 'Performance Mindset', desc: 'Lazy initialization. No framework overhead until needed. Cache-first patterns. Minimal autoloading.' },
]

const ecosystem = [
  { name: 'HTTP', desc: 'Request/response, web services, annotations, security context', repo: 'WebFiori/http' },
  { name: 'Database', desc: 'Query builder, schema, migrations, repositories', repo: 'WebFiori/database' },
  { name: 'Cache', desc: 'Key-value store with TTL, file and Redis backends', repo: 'WebFiori/cache' },
  { name: 'Queue', desc: 'Job dispatching, retry, encryption, pluggable storage', repo: 'WebFiori/queue' },
  { name: 'Event', desc: 'Event dispatcher with class and callable listeners', repo: 'WebFiori/event' },
  { name: 'Container', desc: 'DI with bind, singleton, auto-resolution', repo: 'WebFiori/container' },
  { name: 'CLI', desc: 'Command framework with arguments, formatting, colors', repo: 'WebFiori/cli' },
  { name: 'Mail', desc: 'SMTP email with HTML body and attachments', repo: 'WebFiori/mail' },
  { name: 'UI', desc: 'Programmatic DOM manipulation in PHP', repo: 'WebFiori/ui' },
  { name: 'Log', desc: 'Structured file logging with daily rotation', repo: 'WebFiori/log' },
]
</script>

<template>
  <div>
    <!-- Hero: Matrix rain background + big statement -->
    <div style="position: relative; overflow: hidden; min-height: 100vh; display: flex; align-items: center">
      <AuroraBackground />

      <!-- Code rain effect -->
      <div v-if="showMatrix" class="code-rain">
        <div v-for="i in 20" :key="i" class="rain-column" :style="{ left: (i * 5) + '%', animationDelay: (i * 0.3) + 's', animationDuration: (8 + Math.random() * 6) + 's' }">
          <span v-for="j in 12" :key="j" class="rain-char">{{ ['#[', 'Get', 'Post', '->', '::', 'new', 'fn(', '/**', '};', '$_', '<?', 'use'][j-1] }}</span>
        </div>
      </div>

      <v-container style="position: relative; z-index: 2" class="text-center">
        <FadeIn>
          <v-chip variant="flat" color="primary" class="mb-6" size="large">
            <v-icon start>mdi-rocket-launch</v-icon>
            Version 3.0 — Now Available
          </v-chip>
        </FadeIn>

        <FadeIn :delay="200">
          <h1 class="text-h2 text-md-h1 font-weight-black mb-4">
            Experience the new <span class="gradient-text">WebFiori</span>
          </h1>
        </FadeIn>

        <FadeIn :delay="400">
          <p class="text-h4 text-md-h3 font-weight-light mb-8 statement-text">
            A Saudi Vision, Written in Code.
          </p>
        </FadeIn>

        <FadeIn :delay="600">
          <div class="d-flex flex-wrap justify-center ga-3 mb-10">
            <v-chip variant="tonal" color="secondary" size="large">Rebuilt from the ground up</v-chip>
            <v-chip variant="tonal" color="secondary" size="large">Modern architecture</v-chip>
            <v-chip variant="tonal" color="secondary" size="large">Enterprise-grade engineering</v-chip>
            <v-chip variant="tonal" color="secondary" size="large">Developer-first experience</v-chip>
          </div>
        </FadeIn>

        <FadeIn :delay="800">
          <div>
            <v-btn color="primary" size="x-large" to="/getting-started" class="mr-3" prepend-icon="mdi-rocket-launch" elevation="8">Get Started</v-btn>
            <v-btn variant="outlined" size="x-large" href="https://github.com/WebFiori/framework" target="_blank" prepend-icon="mdi-github">GitHub</v-btn>
          </div>
        </FadeIn>
      </v-container>
    </div>

    <!-- Why v3 Exists -->
    <v-container class="py-16">
      <FadeIn>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold">Why v3 Exists</h2>
          <p class="text-medium-emphasis mt-2 mx-auto" style="max-width: 600px">
            Version 3 isn't an incremental update. It's a complete rethink — informed by years of production use, community feedback, and the evolution of PHP itself.
          </p>
        </div>
      </FadeIn>

      <v-row>
        <v-col v-for="(item, i) in whyV3" :key="item.title" cols="12" sm="6">
          <FadeIn :delay="i * 100">
            <v-card variant="outlined" class="pa-5 h-100 why-card">
              <v-icon :icon="item.icon" size="32" color="primary" class="mb-3" />
              <h3 class="text-h6 font-weight-bold mb-2">{{ item.title }}</h3>
              <p class="text-body-1 text-medium-emphasis">{{ item.desc }}</p>
            </v-card>
          </FadeIn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Architecture Highlights -->
    <v-container fluid class="py-16" style="background: rgba(76,175,80,0.03)">
      <v-container>
        <FadeIn>
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold">Architecture Highlights</h2>
            <p class="text-medium-emphasis mt-2">Not a feature dump. A philosophy.</p>
          </div>
        </FadeIn>

        <v-row>
          <v-col v-for="(item, i) in architecture" :key="item.title" cols="12" sm="6" md="4">
            <FadeIn :delay="i * 80">
              <v-card variant="flat" class="pa-5 h-100 arch-card" color="transparent">
                <v-icon :icon="item.icon" size="28" color="accent" class="mb-2" />
                <h3 class="text-subtitle-1 font-weight-bold mb-1">{{ item.title }}</h3>
                <p class="text-body-2 text-medium-emphasis">{{ item.desc }}</p>
              </v-card>
            </FadeIn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Live Code Examples -->
    <v-container class="py-16">
      <FadeIn>
        <div class="text-center mb-8">
          <h2 class="text-h3 font-weight-bold">See It in Action</h2>
          <p class="text-medium-emphasis mt-2">Real code from the framework. No pseudo-code.</p>
        </div>
      </FadeIn>

      <FadeIn>
        <v-card variant="outlined" max-width="900" class="mx-auto">
          <v-tabs v-model="activeExample" color="primary" grow show-arrows>
            <v-tab v-for="(ex, i) in codeExamples" :key="i" :value="i" class="text-none">{{ ex.label }}</v-tab>
          </v-tabs>
          <v-window v-model="activeExample">
            <v-window-item v-for="(ex, i) in codeExamples" :key="i" :value="i">
              <CodeBlock :code="ex.code" language="php" />
            </v-window-item>
          </v-window>
        </v-card>
      </FadeIn>
    </v-container>

    <!-- Ecosystem -->
    <v-container fluid class="py-16" style="background: rgba(76,175,80,0.03)">
      <v-container>
        <FadeIn>
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold">The Ecosystem</h2>
            <p class="text-medium-emphasis mt-2">14 independent packages. Use together or standalone.</p>
          </div>
        </FadeIn>

        <v-row>
          <v-col v-for="(pkg, i) in ecosystem" :key="pkg.name" cols="12" sm="6" md="4">
            <FadeIn :delay="i * 60">
              <v-card variant="outlined" class="pa-4 h-100 eco-card" :href="'https://github.com/' + pkg.repo" target="_blank">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-package-variant" size="20" color="primary" class="mr-2" />
                  <span class="text-subtitle-1 font-weight-bold">{{ pkg.name }}</span>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">{{ pkg.desc }}</p>
              </v-card>
            </FadeIn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Final CTA -->
    <v-container class="py-16 text-center">
      <FadeIn>
        <h2 class="text-h3 font-weight-bold mb-4">Ready to Build Something Great?</h2>
        <p class="text-h6 text-medium-emphasis mb-8 mx-auto" style="max-width: 500px">
          Install in seconds. Ship with confidence.
        </p>
        <ShimmerBorder class="d-inline-block mb-8">
          <CodeBlock code="composer create-project webfiori/app my-project" language="bash" />
        </ShimmerBorder>
        <div>
          <v-btn color="primary" size="x-large" to="/getting-started" class="mr-3" prepend-icon="mdi-book-open-variant">Documentation</v-btn>
          <v-btn variant="outlined" size="x-large" to="/docs/examples" prepend-icon="mdi-code-tags">Examples</v-btn>
        </div>
      </FadeIn>
    </v-container>
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #4CAF50, #C0CA33, #81C784);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.statement-text {
  opacity: 0.9;
  letter-spacing: -0.5px;
}

/* Code rain animation */
.code-rain {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.06;
  pointer-events: none;
}

.rain-column {
  position: absolute;
  top: -100%;
  display: flex;
  flex-direction: column;
  animation: rain-fall linear infinite;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #4CAF50;
}

.rain-char {
  display: block;
  padding: 4px 0;
  opacity: 0.7;
}

@keyframes rain-fall {
  from { transform: translateY(-100%); }
  to { transform: translateY(200vh); }
}

.why-card {
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.why-card:hover {
  transform: translateY(-2px);
  border-color: rgb(var(--v-theme-primary));
}

.arch-card {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
  padding-left: 20px !important;
}

.eco-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
}
.eco-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.15);
}
</style>
