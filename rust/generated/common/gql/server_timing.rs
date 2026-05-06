use std::time::{Duration, Instant};

use poem::{
  Endpoint, IntoResponse, Middleware, Request,
  Response, Result,
};

use poem::http::header::HeaderValue;

pub fn build_server_timing_header(
  metric_name: &str,
  duration: Duration,
) -> HeaderValue {
  let response_time = format!("{metric_name};dur={}", duration.as_millis());
  HeaderValue::from_str(&response_time)
    .expect("Failed to build Server-Timing header")
}

pub struct ServerTiming;

impl<E: Endpoint> Middleware<E> for ServerTiming {
  
  type Output = ServerTimingImpl<E>;
  
  fn transform(&self, ep: E) -> Self::Output {
    ServerTimingImpl(ep)
  }
  
}

pub struct ServerTimingImpl<E>(E);

impl<E: Endpoint> Endpoint for ServerTimingImpl<E> {
  
  type Output = Response;
  
  async fn call(&self, req: Request) -> Result<Self::Output> {
    
    let now0 = Instant::now();
    
    let response = self.0.call(req).await?.into_response();
    
    let mut response = response;
    response
      .headers_mut()
      .append(
        "Server-Timing",
        build_server_timing_header(
          "http",
          Instant::now().saturating_duration_since(now0),
        ),
      );
    let response = response;
    
    Ok(response)
  }
  
}
