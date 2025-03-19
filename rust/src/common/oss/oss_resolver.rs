use color_eyre::eyre::Result;

use super::oss_model::GetStatsOss;
use super::oss_service::head_object;

pub async fn get_stats_oss(
  ids: Vec<String>,
) -> Result<Vec<Option<GetStatsOss>>> {
  let mut stat_models: Vec<Option<GetStatsOss>> = vec![];
  for id in ids {
    let head = head_object(&id).await?;
    stat_models.push(
      head.map(|head| GetStatsOss {
        id,
        lbl: head.filename,
        content_type: head.content_type.unwrap_or_default(),
        size: head.content_length.unwrap_or_default(),
      })
    );
  }
  Ok(stat_models)
}
