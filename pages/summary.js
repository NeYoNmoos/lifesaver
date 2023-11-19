document.addEventListener('DOMContentLoaded', function() {

  const buttonMax = document.getElementById('Max');
  const buttonMin = document.getElementById('Min');
  const buttonMaxPercentage = document.getElementById('MaxPercentage');
  const buttonMinPercentage = document.getElementById('MinPercentage');
  const orderBar = document.getElementById("orderBar");

  function orderChange(element){
    const childrenArray = Array.from(orderBar.children);

    childrenArray.forEach((child, index) => {
      if (child.classList.contains('bg-secondary')) {
        child.classList.remove('bg-secondary');
      }else if(child.classList.contains('bg-primary')){
        child.classList.remove('bg-primary');
      }

      childrenArray.forEach(child => {
        if (child.id !== element.id) {
            child.classList.add('bg-secondary'); 
        }else{
            child.classList.add('bg-primary');
        }
      });
    });
  }

  buttonMax.addEventListener('click', function() {
    orderChange(buttonMax);
  });

  buttonMin.addEventListener('click', function() {
    orderChange(buttonMin);
  });

  buttonMaxPercentage.addEventListener('click', function() {
    orderChange(buttonMaxPercentage);
  });

  buttonMinPercentage.addEventListener('click', function() {
    orderChange(buttonMinPercentage);
  });

  

});