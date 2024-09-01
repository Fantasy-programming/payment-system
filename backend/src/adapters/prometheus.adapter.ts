import Promclient from "prom-client";

export class Metrics {
  public prometheus: typeof Promclient;
  public register: Promclient.Registry;

  public requestCounter: Promclient.Counter<"method" | "route" | "statusCode">;
  public errorCounter: Promclient.Counter;
  public dbQueryCounter: Promclient.Counter;
  public cacheHitCounter: Promclient.Counter;
  public failedLoginCounter: Promclient.Counter;

  public loginUsersGauge: Promclient.Gauge;
  public dbQueryDurationHistogram: Promclient.Histogram;

  constructor() {
    this.prometheus = Promclient;
    this.register = new this.prometheus.Registry();

    this.register.setDefaultLabels({ app: "ups" });
    this.prometheus.collectDefaultMetrics({
      prefix: "ups_",
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
      register: this.register,
    });

    // setup metrics

    this.requestCounter = new this.prometheus.Counter({
      name: "ups_http_request_count",
      help: "Count of HTTP requests",
      labelNames: ["method", "route", "statusCode"],
    });

    this.register.registerMetric(this.requestCounter);

    this.loginUsersGauge = new this.prometheus.Gauge({
      name: "ups_logged_in_users",
      help: "Number of currently logged in users",
    });

    this.register.registerMetric(this.loginUsersGauge);

    this.errorCounter = new this.prometheus.Counter({
      name: "ups_error_count",
      help: "Count of errors",
    });

    this.register.registerMetric(this.errorCounter);

    this.dbQueryCounter = new this.prometheus.Counter({
      name: "ups_db_query_count",
      help: "Count of database queries",
    });

    this.register.registerMetric(this.dbQueryCounter);

    this.cacheHitCounter = new this.prometheus.Counter({
      name: "ups_cache_hit_count",
      help: "Count of cache hits",
    });

    this.register.registerMetric(this.cacheHitCounter);

    this.failedLoginCounter = new this.prometheus.Counter({
      name: "ups_failed_login_count",
      help: "Count of failed login attempts",
    });

    this.register.registerMetric(this.failedLoginCounter);

    this.dbQueryDurationHistogram = new this.prometheus.Histogram({
      name: "ups_db_query_duration_seconds",
      help: "Duration of database queries in seconds",
      labelNames: ["method", "route"],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.075, 0.1],
    });

    this.register.registerMetric(this.dbQueryDurationHistogram);
  }
}
