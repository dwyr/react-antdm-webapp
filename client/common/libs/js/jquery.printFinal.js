// -----------------------------------------------------------------------
//printFinal 1.0
//jQuery 打印插件
//作者：JsonZou
//时间：2013-10-31
//------------------------------------------------------------------------

(function($) {

  var printFinal={};//printFinal应用容器
  var printOption={};//printFinal应用配置
  printFinal.defaults={//printFinal默认配置
	  preview:true,//打印预览
	  impcss:true,//引入css文件
		iframeName:'printFrame',
	  watermark:null//水印，1.0版本暂不支持
  };
  printFinal.print=function(options){
//0.0打印参数、选项初始化   
    printOption=$.extend({},printFinal.defaults,options);
    var $e= (this instanceof $) ? this : $(this);
//1.0打印容器创建
	  //预览模式下，第一次点击显示预览，第二次点击隐藏预览
	  if(printOption.preview){
		  if($("div.printfinal-modal").length>0){
			  if($("div.printfinal-modal").is(":hidden")){
				  $("div.printfinal-modal").show();
			  }else{
				  $("div.printfinal-modal").hide();
			  }
			  return;
		  }
	  }else{
		  $("div.printfinal-modal").remove();
	  }

	  // 打印弹窗
	  var $containerModal = $("<div class='printfinal-modal' style='background:rgba(0,0,0,0.6);position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000'></div>")
	  //打印容器
	  var $containerDiv=$("<div class='printfinal-container-div-0' style='border: 1px solid rgb(204, 204, 204);background: white;top: 65px;left: 5%;width: 90%; position: absolute; height: 600px;overflow-y: hidden;'></div>");
	  //打印容器top
	  var $containerTopDiv=$("<div class='printfinal-container-top-div-0' style='padding:0 15px;color:#333;width:100%;height:50px;line-height:50px;overflow:hidden;border-bottom:1px solid #ddd;text-align:left;font-size:14px;'></div>");
	  //打印容器top显示的标题
	  var $containerTopTitleDiv=$("<div class='printfinal-container-top-title-div-0' style='width:100px;float:left;font-weight:bold;'>打印预览</div>");
	  //打印容器top显示的关闭按钮div
	  var $containerTopCloseBtnDiv=$("<div class='printfinal-container-top-closebtn-div-0' style='float:right;'></div>");
	  //打印容器top关闭按钮
      var $containerTopPrintBtnDivBtn=$("<button class='printfinal-container-top-printbtn-div-btn-0' style='display:inline-block;color:#444;border:1px solid #ddd;border-radius:3px;background:#fff;line-height:25px;padding:2px 10px;margin-right:15px;'>打印</button>");
      var $containerTopCloseBtnDivBtn=$("<button class='printfinal-container-top-closebtn-div-btn-0' style='display:inline-block;color:#444;border:1px solid #ddd;border-radius:3px;background:#fff;line-height:25px;padding:2px 10px;'>关闭</button>");
	  //打印内容iframe
	  var $containerContentIframe = $("<iframe " + "id='" + printOption.iframeName + "' style='padding:10px;' height='92%' width='100%' marginwidth='0' marginheight='0' frameborder='0' scrolling='auto'></iframe>");
			 
	  //装载容器
	  $containerModal.append($containerDiv);
	  $containerDiv.append($containerTopDiv);
	  $containerTopDiv.append($containerTopTitleDiv);
	  $containerTopDiv.append($containerTopCloseBtnDiv);
      $containerTopCloseBtnDiv.append($containerTopPrintBtnDivBtn);
      $containerTopCloseBtnDiv.append($containerTopCloseBtnDivBtn);

	  $containerDiv.append($containerContentIframe);
				 
	  $("body").append($containerModal);
	  //关闭事件
	  $containerTopCloseBtnDivBtn.click(function(){$containerModal.remove();});
      $containerTopPrintBtnDivBtn.click(function(){$containerContentIframe[0].contentWindow.print();});
	  if(printOption.preview){$containerDiv.show();}
	  var iDoc = $containerContentIframe[0].contentWindow.document;
//2.0引入css文件
			if (printOption.impcss)
					{
						if ($("link[media=print]").length > 0)
						{
							$("link[media=print]").each( function() {
								iDoc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
							});
						}
						else
						{
							$("link").each( function() {
								iDoc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
							});
						}
					}
//3.0导入打印内容        
        iDoc.write($($('<div></div>').html($e.clone())).html()) 
        iDoc.close();
        
//4.0打印        
		if(!printOption.preview){
			setTimeout( function() {$containerContentIframe[0].contentWindow.print()}, 1000);
		}
  }
//5.0扩展到jQuery方法
$.fn.printFinal=printFinal.print;


})(jQuery);