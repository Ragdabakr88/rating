$(function(){

var id = $("#receiverId").val();

   $("#sendmessage").on("click",function(){
   	  
       var message = $.trim($("#msg").val());
       // socket emit send content to server in function called catTo

       if(message === ""){
       	return false;
       }else{
       $.post('/message/'+id,{
       	message:message,
       	id:id
       },function(data){
      //empty message val
       $("#message").val('');
          });
        }
   });
   setInterval(function(){
   	//load refresh element in another one
     $(".msg").load(location.href + " .msg");
   },200)
});