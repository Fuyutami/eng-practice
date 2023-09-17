import { useEffect, useState } from 'react'
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition'
import styled from 'styled-components'

import './App.css'

import Dropdown from './components/Dropdown'
import { data, testData } from './data'
import ProgressBar from './components/ProgressBar'
import SpeakBubble from './components/SpeakBubble'
import { IconMicOff, IconMicOn } from './other/vectors'

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
		/* transform: scale(0.9); */
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
	const {
		transcript,
		resetTranscript,
		listening,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition()
	const [topic, setTopic] = useState(data[0])
	const [progress, setProgress] = useState(0)
	const [speaking, setSpeaking] = useState(false)
	const [word, setWord] = useState(
		topic.words[Math.floor(Math.random() * data.length)]
	)
	const [input, setInput] = useState('')

	const selectTopic = (topic) => {
		setTopic(topic)
	}

	useEffect(() => {
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

	const listenHandler = () => {
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

	const speakHandler = () => {
		if (browserSupportsSpeechRecognition) {
			resetTranscript()
			if (!speaking) {
				setSpeaking(true)
				console.log('speaking')
				SpeechRecognition.startListening({ continuous: true })
			} else {
				setSpeaking(false)
				console.log('not speaking')
				SpeechRecognition.stopListening()
				console.log(transcript)

				// evaluate transcription
				let phrase = word.word.toLowerCase()
				if (phrase[phrase.length - 1] === '.') {
					phrase = phrase.slice(0, -1)
				}

				let input = transcript.toLowerCase()

				if (input === phrase) {
					console.log('correct')
					const audio = new Audio('correct.mp3')
					audio.play()
				} else {
					console.log('wrong')
					const audio = new Audio('wrong.mp3')
					audio.play()
				}
			}
		}
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

		const constant = 0.9
		const percentage = (easyWords.length / topic.words.length) * 100

		const alpha = constant + (100 - percentage) / 1000

		while (true) {
			const random = Math.random()
			if (hardWords.length > 0 && random < alpha) {
				const newWord = hardWords[Math.floor(Math.random() * hardWords.length)]
				if (newWord.id !== word.id) {
					return newWord
				}
			} else if (easyWords.length > 0) {
				const newWord = easyWords[Math.floor(Math.random() * easyWords.length)]
				if (newWord.id !== word.id) {
					return newWord
				}
			} else {
				const newWord = topic.words[Math.floor(Math.random() * data.length)]
				if (newWord.id !== word.id) {
					return newWord
				}
			}
		}
	}

	const clearStorage = () => {
		localStorage.clear()
		window.location.reload()
	}

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
					<Button onClick={listenHandler}>Listen</Button>
					<Button onClick={nextHandler}>Next</Button>
					<Button onClick={easyHandler}>Easy</Button>
					<Button onClick={speakHandler}>
						{speaking ? <IconMicOn /> : <IconMicOff />}
						{/* <SpeakBubble /> */}
					</Button>
				</Controls>
			</MainContainer>
			<Dropdown selectTopic={selectTopic} active={topic} data={data} />
			<ProgressBar progress={progress} />
			<Reset onClick={clearStorage}>Clear</Reset>
		</>
	)
}

export default App
