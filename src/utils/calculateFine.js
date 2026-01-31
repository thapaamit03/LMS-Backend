
function calculateFine(dueDate,returnDate,finePerDay=5){

    if(returnDate<=dueDate) return 0;

    const diffTime=returnDate.getTime()-dueDate.getTime()
    const diffDays=Math.ceil(diffTime/(1000*60*60*24))

    return diffDays*finePerDay;
}

module.exports=calculateFine;