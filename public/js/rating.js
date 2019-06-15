$(function(){

  var clickedValue = 0;
  


    $("#star-1").hover(function(){
  	$("#star-1").attr("src","/images/star_on.png");
  	$("#star-2").attr("src","/images/star_off.png");
    $("#star-3").attr("src","/images/star_off.png");
    $("#star-4").attr("src","/images/star_off.png");
    $("#star-5").attr("src","/images/star_off.png");
    $("#showTitle").html('Bad');
   });
    $("#star-1").on("click" ,function(){
         clickedValue = 1;
         console.log(clickedValue);
           $(".p").html(clickedValue);
    });

    $("#star-2").hover(function(){
  	$("#star-1").attr("src","/images/star_on.png");
  	$("#star-2").attr("src","/images/star_on.png");
    $("#star-3").attr("src","/images/star_off.png");
    $("#star-4").attr("src","/images/star_off.png");
    $("#star-5").attr("src","/images/star_off.png");
    $("#showTitle").html('Poor');
   });
    $("#star-2").on("click" ,function(){
         clickedValue = 2;
           $(".p").html(clickedValue);
    });

    $("#star-3").hover(function(){
  	$("#star-1").attr("src","/images/star_on.png");
  	$("#star-2").attr("src","/images/star_on.png");
    $("#star-3").attr("src","/images/star_on.png");
    $("#star-4").attr("src","/images/star_off.png");
    $("#star-5").attr("src","/images/star_off.png");
    $("#showTitle").html('Fair');
   });
    $("#star-3").on("click" ,function(){
         clickedValue = 3;
           $(".p").html(clickedValue);
    });


    $("#star-4").hover(function(){
  	$("#star-1").attr("src","/images/star_on.png");
  	$("#star-2").attr("src","/images/star_on.png");
    $("#star-3").attr("src","/images/star_on.png");
    $("#star-4").attr("src","/images/star_on.png");
    $("#star-5").attr("src","/images/star_off.png");
    $("#showTitle").html('Good');
   });
    $("#star-4").on("click" ,function(){
         clickedValue = 4;
           $(".p").html(clickedValue);
    });


    $("#star-5").hover(function(){
  	$("#star-1").attr("src","/images/star_on.png");
  	$("#star-2").attr("src","/images/star_on.png");
    $("#star-3").attr("src","/images/star_on.png");
    $("#star-4").attr("src","/images/star_on.png");
    $("#star-5").attr("src","/images/star_on.png");
    $("#showTitle").html('Exellent');
   });
    $("#star-5").on("click" ,function(){
         clickedValue = 5;
           $(".p").html(clickedValue);
    });

  
    $("#rate").on("click",function(){
       var sender = $("#sender").val();
       var review = $("#review").val();
        var id = $("#id").val();
        var valid = true;

        if(clickedValue === 0 || clickedValue > 5){
        	valid = false;

      $("#error").html("<div>please enter rating</div>");
        }else{
        	$("#error").html("");
        }

        if(valid === true){

        	$.ajax({
        		url:"/review/"+id,
        		type:"POST",
        		data:{
        			sender:sender,
        			review:review,
        			clickedValue:clickedValue


        		},success:function(data){

        			$("#sender").val("");
                    $("#review").val("");
                    $("#id").val("");
        		}
        	});

        }else{
            return false
        }

    });
});