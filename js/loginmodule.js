 var db;
if (window.openDatabase) {
    db = openDatabase("TaskDb","2.0","Full Tasks Database",1*1024*1024);
    db.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS users (email TEXT, password TEXT)");
    });
} else {
    alert("WebSQL is not supported by your browser!");
}

function CheckUser(){
        localStorage.useremail = "";
        var email = $("#email").val();
        var password = $("#password").val();
          return new Promise(function(resolve,reject){
          db.transaction(function(tx)
          {
            tx.executeSql("SELECT * from users Where email =  ? and password = ?",[email,password],function(tx,res)
            {
              if(!res){
                reject("error")
              }
              else{
                resolve(res.rows);
                if(res.rows.length>0)
                {
                    console.log(res.rows);
                    localStorage.useremail = res.rows[0]['email'];
                    location.href = "index.html";
                }
                else{
                    alertModal("Sorry","Email or Password is wrong");
                }

              }
            });
          })
    });
}


function alertModal(msgtitle, msgbody) {
  BootstrapDialog.show({
            type:BootstrapDialog.TYPE_DANGER,
            title: msgtitle,
            message: msgbody,
        });

}
