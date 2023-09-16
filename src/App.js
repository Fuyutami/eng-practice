import { useEffect, useState } from 'react'
import styled from 'styled-components'

import './App.css'

import Dropdown from './components/Dropdown'
import { data, testData } from './data'
import ProgressBar from './components/ProgressBar'
import SpeakBubble from './components/SpeakBubble'

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 550px;
`
const FlipCard = styled.div`
	background-color: transparent;
	width: 400px;
	height: 400px;
	perspective: 1000px;
	font-size: 5rem;
	font-weight: bold;

	&:hover {
		cursor: pointer;
	}
`
const FlipCardInner = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	text-align: center;
	transition: transform 0.6s;
	transform-style: preserve-3d;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`
const FlipCardFront = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	background-color: #fff;
	color: #0e2867;
`
const FlipCardBack = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	background-color: #0e2867;
	color: #ffffff;
	transform: rotateY(180deg);
`

const Controls = styled.div`
	display: flex;
`

const Button = styled.button`
	position: relative;
	width: 100px;
	height: 100px;
	background-color: #0e2867;
	color: #ffffff;
	border: none;
	font-size: 2rem;

	&:not(:last-child) {
		margin-right: 10px;
	}

	&:hover {
		cursor: pointer;
		transform: scale(1.1);
	}

	&:active {
		transform: scale(0.9);
	}
`

const Reset = styled.button`
	position: absolute;
	bottom: 20px;
	right: 50px;
	padding: 10px;
	background-color: #0e2867;
	color: #ffffff;
	border: none;
	font-size: 1.5rem;

	&:hover {
		cursor: pointer;
		transform: scale(1.1);
	}
`

function App() {
	const [topic, setTopic] = useState(data[0])
	const [progress, setProgress] = useState(0)
	const [speaking, setSpeaking] = useState(false)

	const [word, setWord] = useState(
		topic.words[Math.floor(Math.random() * data.length)]
	)

	const selectTopic = (topic) => {
		setTopic(topic)
	}

	useEffect(() => {
		console.log('topic changed')
		if (topic) {
			setWord(topic.words[Math.floor(Math.random() * data.length)])
		}

		// localStorage.clear()
		if (!localStorage.getItem(topic.name)) {
			localStorage.setItem(
				topic.name,
				JSON.stringify(new Array(topic.words.length).fill(false))
			)
		}

		const easy = JSON.parse(localStorage.getItem(topic.name))
		const progress = easy.filter((item) => item).length
		setProgress((progress / topic.words.length) * 100)
	}, [topic])

	const speakHandler = () => {
		if ('speechSynthesis' in window) {
			const synthesis = window.speechSynthesis
			const utterance = new SpeechSynthesisUtterance(word.word)

			utterance.voice = synthesis.getVoices()[0] // Set a specific voice
			utterance.rate = 0.7 // Set the speech rate
			synthesis.speak(utterance)
		}
	}
	const easyHandler = () => {
		const easy = JSON.parse(localStorage.getItem(topic.name))
		easy[word.id] = true
		localStorage.setItem(topic.name, JSON.stringify(easy))
		setWord(selectRandomWord())

		const progress = easy.filter((item) => item).length
		setProgress((progress / topic.words.length) * 100)
	}

	const nextHandler = () => {
		setWord(selectRandomWord())
	}

	const cardClickHandler = () => {
		console.log('card clicked')

		if (
			document.querySelector('.FlipCardInner').style.transform ===
			'rotateY(-180deg)'
		) {
			document.querySelector('.FlipCardInner').style.transform = 'rotateY(0deg)'
		} else {
			document.querySelector('.FlipCardInner').style.transform =
				'rotateY(-180deg)'
		}
	}

	const selectRandomWord = () => {
		const easy = JSON.parse(localStorage.getItem(topic.name))

		const easyWords = topic.words.filter((word, index) => {
			return easy[index]
		})
		const hardWords = topic.words.filter((word, index) => {
			return !easy[index]
		})

		while (true) {
			const random = Math.random()
			if (hardWords.length > 0 && random < 0.9) {
				const newWord = hardWords[Math.floor(Math.random() * hardWords.length)]
				if (newWord.id !== word.id) {
					console.log('hard')
					return newWord
				}
			} else if (easyWords.length > 0) {
				const newWord = easyWords[Math.floor(Math.random() * easyWords.length)]
				if (newWord.id !== word.id) {
					console.log('easy')
					return newWord
				}
			} else {
				const newWord = topic.words[Math.floor(Math.random() * data.length)]
				if (newWord.id !== word.id) {
					console.log('random')
					return newWord
				}
			}
		}
	}

	const clearStorage = () => {
		localStorage.clear()
		window.location.reload()
	}

	useEffect(() => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition
		const recognition = new SpeechRecognition()
		recognition.lang = 'en-US'

		// recognition.addEventListener('result', (event) => {
		// 	let word = event.results[0][0].transcript
		// 	console.log('result')

		// 	if (word.toLowerCase() === word.word.toLowerCase()) {
		// 		const audio = new Audio('correct.mp3')
		// 		audio.play()
		// 	}
		// })

		recognition.addEventListener('audiostart', () => {
			console.log('start')
		})

		recognition.addEventListener('audioend', () => {
			console.log('end')
		})

		recognition.onResult = (event) => {
			const current = event.resultIndex

			const transcript = event.results[current][0].transcript
			console.log(word)

			if (transcript.toLowerCase() === word.word.toLowerCase()) {
				const audio = new Audio('correct.mp3')
				audio.play()
			}
		}

		let speak = false

		document.addEventListener('keydown', (event) => {
			if (event.code === 'Space' && !speak) {
				speak = true
				recognition.start()
			}
		})

		document.addEventListener('keyup', (event) => {
			if (event.code === 'Space') {
				// stop recognition
				speak = false
				recognition.stop()
			}
		})
	}, [])
	return (
		<>
			<MainContainer>
				<FlipCard onClick={cardClickHandler}>
					<FlipCardInner className="FlipCardInner">
						<FlipCardFront>{word.word}</FlipCardFront>
						<FlipCardBack>{word.translation}</FlipCardBack>
					</FlipCardInner>
				</FlipCard>
				<Controls>
					<Button onClick={speakHandler}>Listen</Button>
					<Button onClick={nextHandler}>Next</Button>
					<Button onClick={easyHandler}>Easy</Button>
					{/* <Button>
						Say
						<SpeakBubble />
					</Button> */}
				</Controls>
			</MainContainer>
			<Dropdown selectTopic={selectTopic} active={data[0]} data={data} />
			<ProgressBar progress={progress} />
			<Reset onClick={clearStorage}>Clear</Reset>
		</>
	)
}

export default App
