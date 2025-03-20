use color_eyre::eyre::{Result, eyre};

use wx_pay::decode::{decode_wx_pay, WxPayNotify, WxPayResource};

pub async fn wx_pay_notify(
  wx_pay_notify: WxPayNotify,
) -> Result<()> {
  let wx_pay_apiv3 = "";
  let wx_pay_resource: WxPayResource = decode_wx_pay(wx_pay_apiv3, wx_pay_notify)
    .map_err(|err| eyre!("decode_wx_pay error: {err:#?}"))?;
  
  todo!()
}
