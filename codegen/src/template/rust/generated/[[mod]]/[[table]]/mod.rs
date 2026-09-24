pub mod <#=table#>_model;
pub mod <#=table#>_resolver;
pub mod <#=table#>_graphql;
pub mod <#=table#>_service;
pub mod <#=table#>_dao;<#
if (mod === "base" && table === "usr") {
#>
pub mod usr_sync_dao;<#
}
#>

pub fn init() {<#
  if (
    (hasCreateUsrId && hasCreateUsrIdLbl)
    || (hasUpdateUsrId && hasUpdateUsrIdLbl)
    || (hasDeleteUsrId && hasDeleteUsrIdLbl)
  ) {
  #>
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(<#=table#>_dao::sync_usr_lbl_by_usr_id_<#=table#>);<#
  }
  #>
}
