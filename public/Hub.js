if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
}
var basetypes = ["Food","Going Places","Rent/Bills","Clothes","Silly Trinkets","Other","Fun and Drinks","Health","Personal Care","School"];
var typeValues = [0,0,0,0,0,0,0,0,0,0];
var types = [];
function myFunc() {
    var http = new XMLHttpRequest();
    http.open("GET", 'Data.txt', true);
    http.send();
    var rawRows = [];
    var Master = [];
    var expense = 0;
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var rawRows = (this.responseText.split("\n"));
        }
        for (var i = 0; i < rawRows.length; i++) {
            if (rawRows[i].split(",")[0]=="Goal"){

            }else{
                Master.push(rawRows[i].split(","));
            }
        }
        for (var i = 0; i < Master.length-1; i++) {
            let arr = Master[i];
            if (DateRange(arr[2]) && types.includes(arr[1])){
                expense += Number(arr[0]);
            }
        }
        document.getElementById("Expense").innerHTML = "$" + Math.round(expense*100)/100;
    };
}

function Validity() {
    if (document.getElementById("Form").value == "") {
        alert("Enter a valid submission");
        return;
    }
    let dropdown = document.getElementById("ExpenseType").value;
    if (dropdown != "Select Expense Type"){
        return;
    }
    alert("Enter a valid submission");
}

function GetData(){
    myFunc();
    var http = new XMLHttpRequest();
    http.open("GET", 'Data.txt', true);
    http.send();
    var rawRows = [];
    var Master = [];
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var rawRows = (this.responseText.split("\n"));
            for (var i = 0; i < rawRows.length-1; i++) {
                if (rawRows[i].split(",")[0]=="Goal"){

                }else{
                    if (types.includes(rawRows[i].split(",")[1])){
                        Master.push(rawRows[i].split(","));
                    }
                }
            }
            console.log(Master);
            GetRecents(Master);
            barData(Master);
            var typeValues = [0,0,0,0,0,0,0,0,0,0];
            for (var i = 0; i < Master.length; i++) {
                var arr = Master[i];
                var check = DateRange(arr[2]);
                if (check){
                    for (let i = 0;i<types.length;i++){
                        if (arr[1]==types[i]){
                            typeValues[i]+=(Math.round(Number(arr[0])*100))/100;
                        }
                    }
                }
            }
            makePie(typeValues);
        }
    };
}
let chart;
async function makePie(value){
    var sizer = document.body.clientWidth;
    var ctx = document.getElementById('graph');
    var config = {
        type: 'doughnut',
        data: {
          labels: types,
          datasets: [{
            label: 'Dollars Spent',
            data: value,
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
                labels: {
                    color: "white",
                    font: {
                        size: sizer/150
                    }
                }
            },
            title: {
                display: true,
                text: "Expenses by Type",
                color: "white",
                font: {
                    size: sizer/45,
                }
            }
          }
        }
      };

        if(chart){
            chart.data.datasets[0].data = value;
            chart.update();
        }else {
            chart = new Chart(ctx, config);
        }
}

function barData(array){
    var interval = 7;
    let input = document.getElementById("Interval").value;
    if (input == "Day"){
        interval = 1;
    }else if (input == "Month"){
        barMonth(array);
        return;
    }
    var weeks = [];
    var values = [];
    var total = 0;
    var start = new Date(document.getElementById("firstDate").value);
    var next = new Date(document.getElementById("firstDate").value);
    if (start == "Invalid Date"){
        start = new Date(array[0][2]);
    }
    start.setDate(start.getDate()-start.getDay());
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    var next = new Date(start);
    next.setDate(start.getDate()+interval-1);
    next.setHours(24);
    for (let i=0;i<array.length;i++){
        let arr = array[i];
        let check = DateRange(arr[2]);
        if (check){
            let first = Date.parse(start);
            let last = Date.parse(next);
            let date = Date.parse(arr[2]);
            if (date >= first && date < last){
                total += Number(arr[0]);
            }else if (date >= last){
                values.push(total);
                total = 0;
                if (interval == 1){
                    weeks.push(String(start).substring(4,10));
                }else{
                    weeks.push(String(start).substring(4,10)+"-"+String(next).substring(4,10));
                }
                start.setDate(start.getDate()+interval);
                next.setDate(next.getDate()+interval);
                i--;
            }
            

        }
    }
    values.push(total);
    if (interval == 1){
        weeks.push(String(start).substring(4,10));
    }else{
        weeks.push(String(start).substring(4,10)+"-"+String(next).substring(4,10));
    }
    if (new Date(document.getElementById("secondDate").value)!="Invalid Date"){
        let end = Date.parse(new Date(document.getElementById("secondDate").value));
        while (end > Date.parse(next)){
            start.setDate(start.getDate()+7);
            next.setDate(next.getDate()+7);
            if (interval == 1){
                weeks.push(String(start).substring(4,10));
            }else{
                weeks.push(String(start).substring(4,10)+"-"+String(next).substring(4,10));
            }
            values.push(0);
        }
    }
    makeBar(weeks,values);
}

let bar;
async function makeBar(label,value){
    var sizer = document.body.clientWidth;
    var ctx = document.getElementById('bar');
    var config = {
        type: 'bar',
        data: {
          labels: label,
          datasets: [{
            label: 'Dollars Spent',
            data: value,
            borderWidth: 1,
          }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: sizer/150
                        }
                    }
                }
            },
          responsive: true,
          maintainAspenctRatio: false,
          plugins: {
            legend: {
                labels: {
                    color: "white",
                    font: {
                        size: sizer/150
                    }
                }
            },
            title: {
                display: true,
                text: "Expenses by Date",
                color: "white",
                font: {
                    size: sizer/45
                }
            }
          }
        }
      };

        if(bar){
            bar.data.datasets[0].data = value;
            bar.data.labels = label;
            bar.update();
        }else {
             bar = new Chart(ctx, config);
        }
}

function DateRange(date){
    var trial = Date.parse(date);
    var start = Date.parse(new Date(document.getElementById("firstDate").value));
    var end = Date.parse(new Date(document.getElementById("secondDate").value));
    if ( isNaN(start) && isNaN(end)) {
        return true;
    }
    if (trial >= start && trial <= end || isNaN(start) && trial <= end || isNaN(end) && trial >= start){
        return true;
    }else{
        return false;
    }
}

function GetRecents(array){
    var colors = ["#070A52","#5C469C","#9E4784","#A78295","#541212","purple","#E63E6D","#B85C38","#B4A5A5","#7B113A"];
    var recent = [];
    var num = document.getElementById("TransNum").value;
    if (num == ""){
        num = 5;
    }
    if (array.length < 5 || num > array.length){
        num = array.length;
    }
    var j = 0;
    for (let i=0;i<num;i++){
        let temp = array[array.length-1-j];
        if (DateRange(temp[2])){
            let date = temp[2].split(":");
            let truncated = date[0].substring(0,date[0].length-3);
            temp[2] = truncated;
            recent.push(temp);
            j++
        }else{
            i--;
            j++
        }
    }
    document.getElementById("Trans").innerHTML = "";
    for (let i=0;i<recent.length;i++){
        let index = 0;
        let temp = recent[i];
        console.log(temp[1]);
        for (let j = 0; j<colors.length;j++){
            if (types[j] == temp[1]){
                    index = j;
                    break;
            }
        }
        document.getElementById("Trans").innerHTML+= "<div class = 'RecentTrans'>$"+recent[i]+"<div class = 'knob' style='background-color:"+colors[index]+"'></div></div>";
        document.getElementById("Trans").innerHTML+= '<br>';
    }
}

function barMonth(array){
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var intervals = [];
    var values = [];
    var total = 0;
    var start = new Date(document.getElementById("firstDate").value);
    if (start == "Invalid Date"){
        start = new Date(array[0][2]);
    }
    for (let i=0;i<array.length;i++){
        var current = start.getMonth();
        var year = start.getFullYear();
        let arr = array[i];
        if (DateRange(arr[2])){
            if (new Date(arr[2]).getMonth()==current && new Date(arr[2]).getFullYear() == year){
                total += Number(arr[0]);
            }else{
                values.push(total);
                total = 0;
                intervals.push(month[current]+", "+year);
                start.setMonth(start.getMonth()+1);
                i--;
            }
        }
    }
    values.push(total);
    total = 0;
    intervals.push(month[current]+", "+year);
    if (new Date(document.getElementById("secondDate").value)!="Invalid Date"){
        let end = Date.parse(new Date(document.getElementById("secondDate").value));
        while (end > Date.parse(start)){
            var current = start.getMonth();
            var year = start.getFullYear();
            start.setMonth(start.getMonth()+1);
            intervals.push(month[current]+", "+year);
            values.push(0);
        }
    }
    makeBar(intervals,values);

}

function GoalCalc(){
    var http = new XMLHttpRequest();
    http.open("GET", 'Data.txt', true);
    http.send();
    var rawRows = [];
    var Goals = [];
    var Exps = [];
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var rawRows = (this.responseText.split("\n"));
        }
        for (var i = 0; i < rawRows.length; i++) {
            if (rawRows[i].split(",")[0]=="Goal"){
                Goals.push(rawRows[i].split(","));
            }else{
                Exps.push(rawRows[i].split(","));
            }
        }
        for (var i = 0 ; i<Goals.length;i++){
            var total = 0;
            var goal = Goals[i];
            for (var j = 0; j< Exps.length;j++){
                var exp = Exps[j];
                if (Date.parse(goal[2]) >= Date.parse(exp[2]) && Date.parse(goal[1]) <= Date.parse(exp[2])){
                    total+=Number(exp[0]);
                }
            }
            var progress = Math.round(total/goal[3]*100);
            document.getElementById('goals').innerHTML += "<div class='progress'><div class='progress-bar' role='progressbar' style='width: "+progress+"%' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>"+progress+"%</div></div>";
            document.getElementById('goals').innerHTML += "<p> Goal ID: " +i+" Value: "+goal[3]+" Start: "+goal[1].substring(4,10)+" End: "+goal[2].substring(4,10)+"<br>";
        }
        
    };
}

function makeToggles(){
    for (let i=0;i<basetypes.length;i++){
        document.getElementById("Toggles").innerHTML+="<input name = 'hey' type= 'checkbox' id = '"+basetypes[i]+"' checked><label for ="+basetypes[i]+">"+basetypes[i]+"</label><br>";
    }
}

function setTypes(){
    types = [];
    for (let i =0;i<basetypes.length;i++){
        if (document.getElementById(basetypes[i]).checked){
            types.push(basetypes[i]);
        }
    }
}