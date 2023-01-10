// Your code here
var full_year = parseInt(new Date().getFullYear()) // formatting date as int instead of string
// create greet function
function greet() { // declare function
    var name_input = prompt("What is your name?") // declare name input variable and store the response to prompt inside 
    alert("Hello, " + name_input) // create an alert using placeholder text + the prior input
    var userAge = prompt("How old are you, " + name_input + "?") // create the age input variable and store the response to prompt
    userAge = parseInt(userAge) // convert age from String to integer
    if(confirm("If you have already had your birthday this year, click OK. If not, click Cancel.")) { // if else statement that allows for options on OK or cancel.
        alert(new Date().getFullYear() - userAge) // alert with the subtraction of year/age
        } else {
            userAge += 1// I am unsure why I had to parseInt again here, and for a number that wasn't in quotation marks, but it worked.
            alert(new Date().getFullYear() - userAge)
        }
    }

