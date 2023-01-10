const head = document.querySelector('head')
const body = document.querySelector('body')

// mocha CSS link
const mochaCSSPath = "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.css"
const mochaCSSLinkEl = document.createElement('link')
mochaCSSLinkEl.rel = 'stylesheet'
mochaCSSLinkEl.href = mochaCSSPath
head.prepend(mochaCSSLinkEl)

// custom styles for mocha runner
const mochaStyleEl = document.createElement('style')
mochaStyleEl.innerHTML =
  `#mocha {
    font-family: sans-serif;
    position: fixed;
    overflow-y: auto;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 0 96px;
    background: white;
    color: black;
    display: none;
    margin: 0;
  }
  #mocha * {
    letter-spacing: normal;
    text-align: left;
  }
  #mocha .replay {
    pointer-events: none;
  }
  #mocha-test-btn {
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 1001;
    background-color: #007147;
    border: #009960 2px solid;
    color: white;
    font-size: initial;
    border-radius: 4px;
    padding: 12px 24px;
    transition: 200ms;
    cursor: pointer;
  }
  #mocha-test-btn:hover:not(:disabled) {
    background-color: #009960;
  }
  #mocha-test-btn:disabled {
    background-color: grey;
    border-color: grey;
    cursor: initial;
    opacity: 0.7;
  }`
head.appendChild(mochaStyleEl)

// mocha div
const mochaDiv = document.createElement('div')
mochaDiv.id = 'mocha'
body.appendChild(mochaDiv)

// run tests button
const testBtn = document.createElement('button')
testBtn.textContent = "Loading Tests"
testBtn.id = 'mocha-test-btn'
testBtn.disabled = true
body.appendChild(testBtn)

const scriptPaths = [
  "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.4/chai.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/10.0.1/sinon.min.js",
  // "jsdom.js" // npx browserify _jsdom.js --standalone JSDOM -o jsdom.js
]
const scriptTags = scriptPaths.map(path => {
  const scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.src = path
  return scriptTag
})

let loaded = 0
if (localStorage.getItem('test-run')) {
  // lazy load test dependencies
  scriptTags.forEach(tag => {
    body.appendChild(tag)
    tag.onload = function () {
      if (loaded !== scriptTags.length - 1) {
        loaded++
        return
      }
      testBtn.textContent = 'Run Tests'
      testBtn.disabled = false
      testBtn.onclick = __handleClick
      runTests()
    }
  })
} else {
  testBtn.textContent = 'Run Tests'
  testBtn.disabled = false
  testBtn.onclick = __handleClick
}

function __handleClick() {
  if (!localStorage.getItem('test-run') && this.textContent === 'Run Tests') {
    localStorage.setItem('test-run', true)
  } else {
    localStorage.removeItem('test-run')
  }
  window.location.reload()
}

function runTests() {
  testBtn.textContent = 'Running Tests'
  testBtn.disabled = true
  mochaDiv.style.display = 'block'
  body.style.overflow = 'hidden'

  mocha.setup("bdd");
  const expect = chai.expect;

  describe("Greeting Assignment", function () {
    const runBtn = document.getElementById('greet-btn')
    const userAge = 20
    let greetFnSpy
    let alertStub
    let promptStub
    let confirmStub
    function stubPrompt(firstReturn, secondReturn) {
      promptStub = sinon.stub(window, 'prompt')
      promptStub.onFirstCall().returns('Sally')
      promptStub.onSecondCall().returns('20')
    }
    beforeEach(() => {
      if (greet)
        greetFnSpy = sinon.spy(window, 'greet')
      alertStub = sinon.stub(window, 'alert')
      confirmStub = sinon.stub(window, 'confirm').returns(true)
      stubPrompt()
    })
    afterEach(() => {
      sinon.restore()
    })
    after(() => {
      testBtn.textContent = 'Close Tests'
      testBtn.disabled = false
    })
    describe('Setup', () => {
      it('Clicking "Greetings" button should run "greet" function', () => {
        runBtn.click()
        expect(greetFnSpy.called).to.be.true
      })
    })
    describe('greet function', () => {
      it('should prompt user with "What is your name?"', () => {
        runBtn.click()
        expect(/what is your name[\?]{0,1}/gi.test(prompt.firstCall.args[0])).to.be.true
      })
      it('should alert "Hello, Name" after prompting user for name', () => {
        runBtn.click()
        expect(/what is your name[\?]{0,1}/gi.test(prompt.firstCall.args[0])).to.be.true
        expect(/hello[\s,]{0,2}sally/gi.test(alertStub.firstCall.args[0])).to.be.true
      })
      it('should use a prompt to ask the user "How old are you?"', () => {
        runBtn.click()
        expect(/how old are you[\?]{0,1}/gi.test(prompt.secondCall.args[0])).to.be.true
      })
      it('should use a confirm to ask user if his/her birthday has passed this year', () => {
        runBtn.click()
        expect(/birthday/gi.test(confirmStub.firstCall.args[0])).to.be.true
      })
      it("should alert user's birth year if user's birthday has passed this year", () => {
        runBtn.click()
        expect(alertStub.secondCall.args[0].includes(new Date().getFullYear() - userAge)).to.be.true
      })
      it("should alert user's birth year if user's birthday has NOT yet passed this year", () => {
        confirmStub.restore()
        sinon.stub(window, 'confirm').returns(false)
        runBtn.click()
        expect(alertStub.secondCall.args[0].includes(new Date().getFullYear() - userAge - 1)).to.be.true
      })
    })
  });

  mocha.run();
}