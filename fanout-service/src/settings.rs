use anyhow::Result;
use opentelemetry::sdk::trace as sdktrace;
use opentelemetry::sdk::Resource;
use opentelemetry::KeyValue;
use serde::Deserialize;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[derive(Clone, Debug, Deserialize)]
pub struct Settings {
    pub grpc: Grpc,
}

#[derive(Clone, Debug, Deserialize)]
pub struct Grpc {
    pub bind: String,
}

impl Settings {
    pub fn from_env() -> Result<Self> {
        let mut cfg = config::Config::builder()
            .add_source(config::Environment::with_prefix("FANOUT").separator("__"))
            .build()?;

        // defaults
        cfg.set_default("grpc.bind", "0.0.0.0:50055")?;

        let settings: Settings = cfg.try_deserialize()?;
        Ok(settings)
    }
}

pub fn init_tracing() {
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    let formatting_layer = tracing_subscriber::fmt::layer().json();
    tracing_subscriber::registry().with(env_filter).with(formatting_layer).init();
}

