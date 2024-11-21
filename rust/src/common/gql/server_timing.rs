use std::time::Instant;

use poem::{
  Endpoint, IntoResponse, Middleware, Request,
  Response, Result,
};

use poem::http::header::HeaderValue;

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
    
    let now1 = Instant::now();
    let response_time = format!("app;dur={}", now1.saturating_duration_since(now0).as_millis());
    let response_time = HeaderValue::from_str(&response_time).unwrap();
    
    let mut response = response;
    response
      .headers_mut()
      .insert("Server-Timing", response_time);
    let response = response;
    
    Ok(response)
  }
  
}
