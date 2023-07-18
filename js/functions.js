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
/*Палиндром*/

/*Функция, которая принимает время начала и конца рабочего дня, а также время старта и продолжительность встречи в минутах и возвращает true, если встреча не выходит за рамки рабочего дня, и false, если выходит.*/

const getTimeFromString = (str) => {
  const [hours, minutes] = str.split(':').map(Number);
  return {hours, minutes}; /* забирает информацию из строки */
};

function getWorkTime(startOfWorkDay, endOfWorkDay, startOfWorkCall, callDuration) {
  const starOftWork = getTimeFromString(startOfWorkDay);
  const endOfWork = getTimeFromString(endOfWorkDay);
  const startOfCall = getTimeFromString(startOfWorkCall);

  if (startOfCall.hours < starOftWork.hours) {
    return false;
  } /* Если звонок начался раньше рабочего времени возвращать ошибку */

  const hoursLeft = endOfWork.hours - startOfCall.hours;
  const minutesLeft = endOfWork.minutes - startOfCall.minutes;
  const remainingWorkingTime = hoursLeft * 60 + minutesLeft;
  return remainingWorkingTime >= callDuration;
}

getWorkTime ('07:00', '19:00', '12:00', 70);
