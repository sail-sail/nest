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
      head.map(|head| {
        
        let filename = head.filename;
        
        // filename 需要url解码
        let filename = urlencoding::decode(&filename)
          .map(|s| s.to_string())
          .unwrap_or(filename);
        
        GetStatsOss {
          id,
          lbl: filename,
          content_type: head.content_type.unwrap_or_default(),
          size: head.content_length.unwrap_or_default(),
        }
      })
    );
  }
  Ok(stat_models)
}
