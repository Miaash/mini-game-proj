;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  

  //시작한다는 의미의 init함수 구현
  const init = () => {
    get('form').addEventListener('submit', (event) =>{
      playGame(event)
    })

    setPassword()

  }

  const baseball = {
    limit: 10,
    digit: 4,
    trial: 0,
    end: false,
    //각 셀렉터들 인스턴스로 잡아두기
    $question: get('.ball_question'),
    $answer: get('.ball_answer'),
    $input: get('.ball_input'),
  }

  //객체 안에 있는 key 정의를 distructuring (구조분해할당)-> 각 개체의 값들을 미리 선언
  const { limit, digit, $question, $answer, $input } = baseball
  //const는 재할당이 불가능 -> 바뀌는 값은 let으로 선언
  let { trial, end } = baseball



  
  const setPassword = () => {
    // 패스워드를 지정해줍니다.
    const gameLimit = Array(limit).fill(false)
    //10개의 limit 배열 상자를 만들어준다 그 10개의 배열상자 안에 각각 false로 채워준다
    let password =''
    while (password.length < digit) {
      const random = parseInt(Math.random() * 10, 10)

      if (gameLimit[random]) {
        continue
      }

      password += random
      gameLimit[random] = true
      //4자리수가 찰 때까지 반복
    }
    baseball.password = password
    // console.log(password)
  }

  const onPlayed = (number, hint) => {
    //시도를 했을 때 number: 내가 입력한 숫자, hint: 현재 어떤 상황?
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`
  }

  const isCorrect = (number, answer) => {
    //번호가 같은가?
    return number === answer
  }

  const isDuplicate = (number) => {
    //중복번호가 있는가? 
    return [...new Set(number.split(''))].length !== digit
    //new Set()은 새로운 배열을 중복없이 반환하는 성질을 가지고 있음, 하나의 Set 배열 값은 한번만 나타날 수 있음. 
  }

  const getStrikes = (number, answer) => {
    //스트라이크 카운트는 몇개?
    let strike = 0
    const nums = number.split('')

    nums.map((digit, index) => {
      //사용자가 입력한 값에서 정확하게 일치하는 값이 있다면 strike 값을 올려줌, map은 새로운 배열은 반환함
      if(digit === answer[index]) {
        strike++
      }
    })

    return strike
  }

  const getBalls = (number, answer) => {
    //볼 카운트는 몇개?
    let ball = 0
    const nums = number.split('')
    const gameLimit = Array(limit).fill(false)

    answer.split('').map((num) => {
      gameLimit[num] = true
    })


    //자릿수가 정확하게 일치하지 않아도 결과값에 있는 위에 num과 true 값으로 일치하기 때문에 ball 카운터가 + 됨
    nums.map((num, index) => {
      if(answer[index] !== num && !!gameLimit[num]) {
        ball++
      }
    })

    return ball
  }

  const getResult = (number, answer) => {
    //시도에 따른 결과는?
    if (isCorrect(number, answer)) {
      end = true
      $answer.innerHTML = baseball.password
      return '홈런!!!⚾️⚾️⚾️⚾️⚾️'
    }

    const strikes = getStrikes(number, answer)
    const balls = getBalls(number, answer)

    return 'STRILKE: ' + strikes + ', BALL:' + balls
  }

  const playGame = (event) => {
    //게임을 플레이 했을때 
    event.preventDefault();

    if(!!end) {
      return
    }

    const inputNumber = $input.value
    const { password } = baseball

    if (inputNumber.length !== digit) {
      alert(`${digit}자리 숫자를 입력해주세요.`)
    } else if (isDuplicate(inputNumber)) {
      alert('중복 숫자가 있습니다.')
    } else {
      trial++

      // 사용자가 입력한 값과 실제 정답값을 넘겨서 비교해주고, 맞다면 성립조건, 틀리다면 실패라는 것을 넘겨주게됨-> onPlayed 값을 넘겨서 위에 함수를 통해 hint 값을 받아오도록 함
      const result = onPlayed(inputNumber, getResult(inputNumber, password))
      $question.innerHTML += `<span>${result}</span>`


      if(limit <= trial && !isCorrect(inputNumber, password)) {
        alert('쓰리아웃')
        end = true
        $answer.innerHTML = password
      }
    }
    $input.value = ''
    $input.focus()
  }
  

 init()
})()
