function addTask()
{
  let task=document.getElementById("TI").value;
  let li=document.createElement("li");
  li.innerText=task;
  document.getElementById("taskList").appendChild(li);
  let task=document.getElementById("TI").value="";
}
