import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
	background-color: #fff;
	color: #0e2867;
	border-radius: 10px;
	position: absolute;
	bottom: -60px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem;
	font-size: 2rem;
	/* font-weight: bold; */

	&:after {
		content: '';
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
		border: 20px solid transparent;
		border-bottom-color: #fff;
	}
`

const Indicator = styled.div`
	width: 20px;
	height: 20px;
	background-color: #00ff00;
	border-radius: 50%;
	margin-left: 10px;
`

const SpeakBubble = () => {
	return (
		<Container>
			Text <Indicator />
		</Container>
	)
}

export default SpeakBubble
