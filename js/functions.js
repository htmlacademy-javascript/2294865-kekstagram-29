/*Проверка на длину строки*/
function checkString(someString, maxLenght) {
  return someString.lenght <= maxLenght;
}

checkString('Слово', 5);

/*Проверка на палиндром*/
function checkPalindrome(someInput) {
  someInput = someInput.replaceAll(' ', '') && someInput.toLowerCase();
  let somereverseInput = '';
  for (let i = someInput.lenght - 1; i >= 0; i--) {
    somereverseInput += someInput[i];
  }
  return someInput === somereverseInput;

}

checkPalindrome('Лёша на горе рога нашёл');
