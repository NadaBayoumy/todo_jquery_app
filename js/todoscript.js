function dragstart(e) {
	  console.log(e.target.id);
	  e.dataTransfer.setData("eleid",e.target.id)
	  $(this).css("cursor", "no-drop");
	  console.log("drag started!");
}
function dragover(e){
	  e.preventDefault();
	  console.log("dragged over!");
}

function dragout(e){
	  e.preventDefault();
	  console.log("dragged out!");
}

function drop(e){
	  var id = e.dataTransfer.getData("eleid");
	  var divtarget = e.target.id;``

	  if(divtarget == "divCompleted" || divtarget == "divUncompleted")
	  {
			  if(divtarget == "divCompleted")
			  {
			  	if(divtarget == "divCompleted"){

					  e.target.appendChild(document.getElementById(id))
						$('#'+id).toggleClass('taskelementcomp');
						$('#'+id).toggleClass('taskelementun-comp');

					  e.preventDefault();
					  console.log(document.getElementById(id))
					  tasksfns.updateTaskSetCompleted(1,id);
					  console.log("Nada in completed");
				  }
				  else
				  {
				  	  var id = e.dataTransfer.getData("eleid");
				  	  var divtarget = e.target.id;
				  	  //console.log(e.target.parent);
				  	  e.target.appendChild(document.getElementById(id))
							$('#'+id).toggleClass('taskelementcomp');
							$('#'+id).toggleClass('taskelementun-comp');


					  e.preventDefault();
					  console.log(document.getElementById(id));
					  console.log("the id is before update as completed " + id);
					  tasksfns.updateTaskSetCompleted(1,id);
					  console.log("Nada in completed in else");
				  }
			 	}
			 	else
			 	{
				  	if(divtarget == "divUncompleted"){
					  e.target.appendChild(document.getElementById(id))
						$('#'+id).toggleClass('taskelementcomp');
						$('#'+id).toggleClass('taskelementun-comp');

					  e.preventDefault();

					  console.log(document.getElementById(id));
					  console.log("the id is before update as completed " + id);

					  tasksfns.updateTaskSetCompleted(0,id);
					  console.log("Nada in not completed");
					  }
					  else
					  {
					  	  var id = e.dataTransfer.getData("eleid");
					  	  var divtarget = e.target.id;

					  	  e.target.appendChild(document.getElementById(id))
								$('#'+id).toggleClass('taskelementcomp');
								$('#'+id).toggleClass('taskelementun-comp');

							  e.preventDefault();
							  console.log(document.getElementById(id))
							  tasksfns.updateTaskSetCompleted(0,id);
							  console.log("Nada in not completed in else");
					  }
			    }

	    }
	    else
	    {
	    		var divtarget = e.target.id;

					var divcomp  = $(e.target).parent().closest('div[id=divCompleted]').attr('id')
					var divnotcomp  = $(e.target).parent().closest('div[id=divUncompleted]').attr('id')

					if(divcomp){
						  $('#divCompleted').append(document.getElementById(id))
						  e.preventDefault();
						  console.log(document.getElementById(id))
						  tasksfns.updateTaskSetCompleted(1,id);
						  console.log("Nada in completed");
					}
					else{
						 $('#divUncompleted').append(document.getElementById(id))
						  e.preventDefault();
						  console.log(document.getElementById(id))
						  tasksfns.updateTaskSetCompleted(0,id);
						  console.log("Nada in completed");
					}

	    }
}
