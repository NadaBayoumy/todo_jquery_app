var TODOS=[]
var tasksfns

var useremail = localStorage.getItem('useremail');
console.log("mail of logged in user is >>>>" + useremail);
$(document).ready(function() {
    var db = openDatabase("TaskDb","2.0","Full Tasks Database",1*1024*1024);
    tasksfns = {
                    createTable: function() {
                    db.transaction(function (tx) {
                      tx.executeSql("create table if not exists Tasks (name, description,email,completed,date)");
                    });
                    },

                    insertTask: function(task) {
                    db.transaction(function (tx) {
                      tx.executeSql("INSERT INTO Tasks  VALUES(?, ?,?, ?,?)",[task.name,task.description,localStorage.getItem('useremail'),task.completed,new Date($.now())]);
                    })
                    },

                    updateTask: function(name,description) {

                    db.transaction(function (tx) {
                      tx.executeSql("UPDATE Tasks set description=? WHERE name=?",[description,name]);
                    })
                    },

                    updateTaskSetCompleted: function(iscomp,name) {

                    db.transaction(function (tx) {
                      tx.executeSql("UPDATE Tasks set completed=? WHERE name=?",[iscomp,name]);
                    })
                    },

                    selectAllTasks:function(){
                    return new Promise(function(resolve,reject){
                    db.transaction(function(tx)
                    {
                      tx.executeSql("SELECT * from tasks where email = ? ",[localStorage.getItem('useremail')],function(tx,res)
                      {
                        if(!res){
                          reject("error")
                        }
                        else{
                          resolve(res.rows)
                          TODOS = res.rows;
                        }
                      });
                    })
                    });
                  },

                  selectTaskDetails:function(name){
                  return new Promise(function(resolve,reject){
                  db.transaction(function(tx)
                  {
                    tx.executeSql("SELECT * from tasks Where name = ",[name],function(tx,res)
                    {
                      if(!res){
                        reject("error")
                      }
                      else{
                        console.log('iam here in details');
                        resolve(res.rows)
                        console.log(res.rows)

                      }
                    });
                  })
                  });
                },


                renderTasktoform:function(tasks){
                  var completed_div =$('#divCompleted');
                  var uncompleted_div = $('#divUncompleted');
                  var i =0;

                  var htmloficon = "<span class='glyphicon glyphicon-align-left' aria-hidden='true'></span>";
                if(tasks[i].completed == "1"){
                  completed_div.append("<hr/><hr/><hr/><hr/><hr/><div  class='taskelement' id="+tasks[i].name+" ondragstart='dragstart(event)' draggable='true' >"+tasks[i].name+"<button class='edit completed' id=edit_"+tasks[i].name+">Edit</button><button class='delete completed' id=delete_"+tasks[i].name+">Delete</button>"+htmloficon+"</div>");
                }
                else{
                  uncompleted_div.append("<hr/><hr/><hr/><hr/><hr/><div  class='taskelement' id="+tasks[i].name+" ondragstart='dragstart(event)' draggable='true' >"+tasks[i].name+"<button  class='edit uncompleted' id=edit_"+tasks[i].name+"> Edit</button><button class='delete uncompleted' id=delete_"+tasks[i].name+">Delete</button>"+htmloficon+"</div>");
                }
                },
                renderTasksfromJson:function(tasks)
                {
                  var completed_div =$('#divCompleted');
                  var uncompleted_div = $('#divUncompleted');
                  tasksobj = JSON.parse(tasks);
                  for (var i = 0; i < tasksobj.length; i++) {

                    if(tasksobj[i].status == "completed"){
                      completed_div.append("<br/><br/><br/><div  class='taskelement' id=\""+tasksobj[i].title+"\" ondragstart='dragstart(event)' draggable='true' >"+tasksobj[i].title+"<button class='edit completed' id=edit_"+tasksobj[i].title+">Edit</button><button class='delete completed' id=delete_"+tasksobj[i].title+">Delete</button></div>");

                    }
                    else{
                      uncompleted_div.append("<br/><br/><br/><div  class='taskelement' id=\""+tasksobj[i].title+"\" ondragstart='dragstart(event)' draggable='true' >"+tasksobj[i].title+"<button  class='edit uncompleted' id=edit_"+tasksobj[i].title+"> Edit</button><button class='delete uncompleted' id=delete_"+tasksobj[i].title+">Delete</button></div>");
                    }
                  }
                  completed_div.append("<button id='addcompleted' class='add completed'> ADD In Completed </button>");
                  uncompleted_div.append("<button id='adduncompleted' class='add uncompleted'> Add In Un Completed </button>");
                },
                renderTasks:function(tasks)
                {
                  var completed_div =$('#divCompleted');
                  var uncompleted_div = $('#divUncompleted');

                  for (var i = 0; i < tasks.length; i++) {

                    var htmloficonCompleted = "<span class=' glyphicon glyphicon-trash delete completed' id=delete_"+tasks[i].name+" aria-hidden='true'  ></span>"
                    var htmloficonUncompleted = "<span class=' glyphicon glyphicon-trash delete uncompleted' id=delete_"+tasks[i].name+" aria-hidden='true' ></span>"
                    var htmlofdetailslink = "<a href='index.html'>details</a>"

                    if(tasks[i].completed == "1")
                    {
                      completed_div.append("<br/><div  class='taskelement taskelementcomp' id=\""+tasks[i].name+"\" ondragstart='dragstart(event)' draggable='true' >"+ htmloficonCompleted+"<h2>"+tasks[i].name+"</h2><p class='taskeldesc'>"+tasks[i].description+"</p><div> Date: "+tasks[i].date+"</div><div>Add By: "+localStorage.getItem('useremail')+"</div><button style='visibility:hidden' class='edit completed' id=edit_"+tasks[i].name+">Edit</button></div>");
                    }
                    else
                    {
                      uncompleted_div.append("<br/><div  class='taskelement taskelementun-comp' id=\""+tasks[i].name+"\" ondragstart='dragstart(event)' draggable='true' >"+htmloficonUncompleted+"<h2>"+tasks[i].name+"</h2><p class='taskeldesc'>"+tasks[i].description+"</p><div> Date: "+tasks[i].date+"</div><div>Add By: "+localStorage.getItem('useremail')+"</div><button style='visibility:hidden'  class='edit uncompleted' id=edit_"+tasks[i].name+"> Edit</button></div>");
                    }
                  }

                },
                deleteTask: function(name)
                {
                  db.transaction(function (tx) {
                    console.log(name)
                  tx.executeSql("DELETE FROM Tasks WHERE name=?",[name]);
                })}
}



alldet();

function alldet() {
        var tasks = tasksfns.selectAllTasks().then(function(res){
          console.log(res)
          tasksfns.renderTasks(res)
        },function(err){
        });
}

var existCondition = setInterval(function() {

if ($('.taskelement').length) {
    console.log("Exists!");
    clearInterval(existCondition);
   $('.taskelement').addClass("bounceInUp").viewportChecker({
    classToAdd: 'animated',
    offset: 100
   });
 }
}, 100);





var globalid = "";
$('body').on('click','.edit',function(){
  var completed_div =$('#divCompleted');
  var uncompleted_div = $('#divUncompleted');
  var name = $(this).parent('.taskelement').attr("id");

  console.log("id is "+name);

  globalid = name;
  console.log(TODOS.length);
  for (var i = 0; i < TODOS.length; i++) {
    if(TODOS[i].name == name){
      console.log("yes name")
      console.log(TODOS[i]);
      if(TODOS[i].completed == "1"){
        completed_div.append("<form class='edittaskform taskelementcomp'><input type='text' name='name' placeholder='name' value='"+ TODOS[i].name +"'   /><input type='text' name='description' placeholder='description' value='"+ TODOS[i].description +"' /> <input type='hidden' name='completed' value='1'/><input type='submit' value='submit'/><input type='reset' value='cancel'/> </form>");
      }else{
        uncompleted_div.append("<form class='edittaskform taskelementun-comp'><input type='text' name='name'  placeholder='name' value='"+ TODOS[i].name +"'  /><input type='text' name='description' placeholder='description' value='"+ TODOS[i].description +"' /> <input type='hidden' name='completed' value='0'/> <input type='submit' value='submit'/> <input type='reset' value='cancel'/></form>");
      }
    }
  }
});


$('body').on('click','.delete',function(){
   var tasktoconfirm = $(this).parent('.taskelement').attr("id");
   console.log(tasktoconfirm);
    BootstrapDialog.confirm({
        title: 'WARNING',
        message: 'Warning! Drop your Task?',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: 'Do not drop it!',
        btnOKLabel: 'Drop it!',
        btnOKClass: 'btn-warning',
        callback: function(result) {
            if(result) {

                $('#'+tasktoconfirm).remove();
                tasksfns.deleteTask(tasktoconfirm);
            }else {

            }
        }
    });

});

$('body').on('click','.add',function(){
  var completed_div =$('#divCompleted');
  var uncompleted_div = $('#divUncompleted');

  if($(this).hasClass('completed')){

    BootstrapDialog.show({
    type:BootstrapDialog.TYPE_PRIMARY,
    title: "Add New COMPLETED Task",
    message:
    "<form class='addtaskform'><input type='text' name='name' placeholder='name' /><input type='text' name='description' placeholder='description' /> <input class='form-control' type='date' name='date'/> <input type='hidden' name='completed' value='1'/><button>SUBMIT</button> </form>" ,
    buttons: [{
        id: 'btn-1',
        label: 'close',
        action: function(dialog) {
          dialog.close();
        }
    }]
    });
  }else{
    BootstrapDialog.show({
    type:BootstrapDialog.TYPE_WARNING,
    title: "Add New UN-COMPLETE Task",
    message:
    "<form class='addtaskform'><input type='text' name='name'  placeholder='name'/><input type='text' name='description' placeholder='description' />  <input class='form-control' type='date' name='date'/> <input type='hidden' name='completed' value='0'/> <button>SUBMIT</button> </form>" ,
    buttons: [{
        id: 'btn-2',
        label: 'close',
        action: function(dialog) {
          dialog.close();
        }
    }]
    });

  }
});



 $('body').addClass('.taskelement').on('dblclick', function(e){
      var completed_div =$('#divCompleted');
      var uncompleted_div = $('#divUncompleted');
      var name;
      if($(this).hasClass('.taskelement'))
      {
          var name =  e.target.id;
      }
      console.log("id is "+name);
      globalid = name;
      console.log(TODOS.length);
      var element =$('#'+name);
      var position = element.position();
      console.log( "left: " + position.left + ", top: " + position.top );
      for (var i = 0; i < TODOS.length; i++) {
        if(TODOS[i].name == name){
          console.log("yes name")
          console.log(TODOS[i]);
          element.prepend("<form class='edittaskform' style='top: "+ position.top +"px' >Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' name='name' placeholder='name' value='"+ TODOS[i].name +"' class='form-control editforminput'  /><br/>Description: <input type='text' name='description' placeholder='description' value='"+ TODOS[i].description +"' class='form-control editforminput' />  <input type='hidden' name='completed' value='1'/><input class='btn btn-primary' type='submit' value='update'/> <input class='btn btn-warning warn' type='reset' value='X'/>  </form>");
        }
      }
});




function explode(){
  window.location.reload(true);
}


$('body').on('submit','form',function(e){
      if($(this).hasClass('addtaskform')){
          e.preventDefault();
          console.log("submitted");
          var formData = $('form').serializeArray();
          var task={};
          for (var i = 0; i < formData.length; i++) {
            task[formData[i].name] = formData[i].value;
          }
          console.log(task);
          tasksfns.insertTask(task);
          setTimeout(explode, 300);
      }
      if($(this).hasClass('edittaskform')){
          e.preventDefault();
          console.log("submitted");
          var formData = $('form').serializeArray();
          console.log(formData);
          var task={};
          for (var i = 0; i < formData.length; i++) {
            task[formData[i].name] = formData[i].value;
          }
          tasksfns.updateTask(task.name,task.description);
      }
});


$('body').on('click','#searchbtn',function(){
  console.log(TODOS);
   for (var i = 0; i < TODOS.length; i++) {
     console.log(TODOS[i].name);
     if(TODOS[i].name == $('#searchtxt').val())
     {
          var html_to_show_task_details = '<div style=""><div class="alert alert-info" role="alert"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>   '+TODOS[i].name+'</div></div>';
          html_to_show_task_details += '<div style=""><div class="alert alert-info" role="alert"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>      '+TODOS[i].description+'</div></div>';
          html_to_show_task_details += '<div style=""><div class="alert alert-warning" role="alert"><span class="glyphicon glyphicon-time" aria-hidden="true"></span>      '+TODOS[i].date+'</div></div>';

          if(TODOS[i].completed==1)
          {
            html_to_show_task_details += '<div style=""><div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>     '+ TODOS[i].completed +'</div></div>';
          }
          else
          {
            html_to_show_task_details += '<div style=""><div class="alert alert-danger" role="alert"> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>    '+ TODOS[i].completed +'</div></div>';
          }

           BootstrapDialog.show({
           type:BootstrapDialog.TYPE_PRIMARY,
           title: "Task Details",
           message:
             html_to_show_task_details,
           buttons: [{
               id: 'btn-2',
               label: 'close',
               action: function(dialog) {
                 dialog.close();
               }
           }]
           });

     }
   }
});

});
