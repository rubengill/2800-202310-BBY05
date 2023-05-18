function addButton() {
    const containerIds = ["frmTask1"];
    
    // //testing if concat string gets the form corr to curr task
    // var myForm = "frmTask" + currentTask;
    // const testContainer = document.getElementById(myForm);
    // const testTopSection = testContainer.querySelector("#topSection");
    // testTopSection.innerHTML += `<button>BALLS</button>`;

    containerIds.forEach((containerId) => {
        const container = document.getElementById(containerId);
        const topSection = container.querySelector(".topSection");
        topSection.innerHTML += "<button>s</button>";
        console.log(currentTask);
    });
}

window.onload = function() {
    addButton();
  };