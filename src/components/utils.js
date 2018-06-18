/*
* 封装的工具方法
* 2017-12-22
*/
export default {
  getTime: function(){
    let date = new Date();
    let m = (date.getMonth() + 1);
    let d = date.getDate()
    m = m<10 ? '0'+m : m;
    d = d<10 ? '0'+d : d;
    return date.getFullYear() + '-' + m + '-' + d
  },
  formatDate: function(ts,type){
    Date.prototype.toForm = function() {
      let m = (this.getMonth() + 1);
      let d = this.getDate()
      m = m<10 ? '0'+m : m;
      d = d<10 ? '0'+d : d;
      return this.getFullYear() + "-" + m + "-" + d;// + " " + this.getHours() + ":" + this.getMinutes();// + "分" + this.getSeconds() + "秒";
    };
    Date.prototype.toFormym = function() {
      let m = (this.getMonth() + 1);
      let d = this.getDate()
      m = m<10 ? '0'+m : m;
      d = d<10 ? '0'+d : d;
      return this.getFullYear() + "年" + m + "月";// + " " + this.getHours() + ":" + this.getMinutes();// + "分" + this.getSeconds() + "秒";
    };
    if(type=='ym'){
      return new Date(ts).toFormym()
    }
    // console.log(typeof ts);
    return new Date(ts).toForm()
  },
  updateMoney(val){
    if(!val){
      val=""
    }
    if(isNaN(Number(val.toString().replace(/,/g,'')))){
      return 0;
    }else{
      return val.toString().replace(/,/g,'')
    }
  },
  //格式化金额 result="12,345.67"
  formatCurrency:function(num) {
      if(!num){
        return "0.00";
      }
      num = num.toString().replace(/\$|\,/g,'');
      if(isNaN(num))
      num = "0.00";
      let sign = (num == (num = Math.abs(num)));
      num = Math.floor(num*100+0.50000000001);
      let cents = num%100;
      num = Math.floor(num/100).toString();
      if(cents<10)
      cents = "0" + cents;
      for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
      num = num.substring(0,num.length-(4*i+3))+','+
      num.substring(num.length-(4*i+3));
      return (((sign)?'':'-') + num + '.' + cents);
  },

  // 解密格式化金额  result = "12345.67"
   unmakeFormatCurrecy:function(num ){
       if(num.indexOf(",") > 0 ){
           return parseFloat(num.replace(/[^\d\.-]/g, ""));
       }else{
           return num  ;
       }

   },
   getDays: function(startDate,endDate,standardTime){
     let d = new Date(endDate) - new Date(startDate)
     let days = endDate=='' || startDate=='' ? 0 : Math.ceil(d/1000/60/60/24)+Number(standardTime)
     days = isNaN(days) ? standardTime : days
     return days < 0 ? standardTime : days
   },

   getItemDate: function(item){
     let date = ''
     if(item.type==='travel'){
       date=this.formatDate(item.startDate)+'至'+this.formatDate(item.endDate)
     }else if(item.type==='hotel'){
       date=this.formatDate(item.startDate)+'至'+this.formatDate(item.endDate)
     }else if(item.type==='eating'){
       date=this.formatDate(item.eatingDate)
     }else if(item.type==='communicate'){
       date=this.formatDate(item.communicateStart)+'至'+this.formatDate(item.communicateEnd)
     }else if(item.type==='other'){
       date=this.formatDate(item.otherDate)
     }
     return date
   },
   getItemAddress: function(item){
     let str = ''
     if(item.type==='travel'){
       str=item.fromCity+'-'+item.toCity+' '+item.travelWay
     }else if(item.type==='hotel'){
       str=item.city+'-'+item.hotel
     }else if(item.type==='eating'){
       str=item.company+'-'+item.personNum+'人'
     }else if(item.type==='communicate'){
       str=item.communicateType
     }else if(item.type==='other'){
       str=item.note
     }
     return str
   },
   getItemCategory:function(item,type){
     let str = ''
     let str1 = ''
     if(item.category=='ctrip_aircraft'){
       str='携程机票'
       str1='N'
     }else if(item.category=='ctrip_aircraft_c'){
       str='携程机票'
       str1='Y'
     }else if(item.category=='ctrip_train'){
       str='携程火车票'
       str1='N'
     }else if(item.category=='ctrip_train_c'){
       str='携程火车票'
       str1='Y'
     }else if(item.category=='mt_train'){
       str='美团火车票'
       str1='N'
     }else if(item.category=='mt_train_c'){
       str='美团火车票'
       str1='Y'
     }else if(item.category=='dd_person_pay'){
       str='滴滴'
       str1='N'
     }else if(item.category=='dd_company_pay'){
       str='滴滴'
       str1='Y'
     }else if(item.category=='red_fire'){
       str='红火台'
       str1='N'
     }else if(item.category=='red_fire_c'){
       str='红火台'
       str1='Y'
     }else if(item.category=='ctrip_inn'){
       str='携程酒店'
       str1='N'
     }else if(item.category=='ctrip_inn_c'){
       str='携程酒店'
       str1='Y'
     }else if(item.category=='sq_company_pay'){
       str='首汽'
       str1='Y'
     }else if(item.category=='sq_person_pay'){
       str='首汽'
       str1='N'
     }else if(item.category=='einvoice'){
       str='电子发票'
       str1='N'
     }else if(item.category=='cas_company_advance_pay'){
       str='中航服垫款支付'
       str1='Y'
     }else if(item.category=='cas_company_uatp_pay'){
       str='中航服uatp支付'
       str1='Y'
     }else if(item.category=='cas_person_pay'){
       str='中航服支付宝支付'
       str1='N'
     }
     return type===undefined ? str : str1
   }
}
