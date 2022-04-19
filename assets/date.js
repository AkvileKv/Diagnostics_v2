
document.addEventListener('DOMContentLoaded', function(){
    const currentYear = document.querySelector('#currentYear');

    function date() {
       currentYear.innerHTML = new Date().getFullYear();
    };

    date();
});
