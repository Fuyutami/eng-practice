import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
	width: 200px;
	height: 20px;
	position: absolute;
	bottom: 20px;
	left: 20px;
`

const Bar = styled.div`
	width: 100%;
	height: 100%;
	background-color: #f43e3e;

	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: ${(props) => props.$percentage}%;
		height: 100%;
		background-color: #4caf50;
	}
`

const ProgressBar = (props) => {
	return (
		<Container>
			<Bar $percentage={props.progress} />
		</Container>
	)
}

export default ProgressBar
