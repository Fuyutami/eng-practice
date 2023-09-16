import React, { useState } from 'react'
import styled from 'styled-components'

// Styled components
const DropdownContainer = styled.div`
	position: absolute;
	top: 20px;
	left: 20px;
	display: inline-block;
`

const DropButton = styled.button`
	background-color: #4caf50;
	color: white;
	padding: 12px;
	border: none;
	cursor: pointer;
`

const DropContent = styled.div`
	display: ${(props) => (props.open ? 'block' : 'none')};
	position: absolute;
	background-color: #f1f1f1;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
	z-index: 1;
`

const DropItem = styled.a`
	font-size: 2rem;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
	color: black;
	&:hover {
		background-color: #ddd;
		cursor: pointer;
	}
`

// Dropdown component
const Dropdown = (props) => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	const selectHandler = (id) => {
		console.log(id)
		setIsOpen(false)
		props.selectTopic(props.data[id])
	}

	return (
		<DropdownContainer>
			<DropButton onClick={toggleDropdown} className="dropbtn">
				{props.active.name}
			</DropButton>
			<DropContent open={isOpen} className="dropdown-content">
				{props.data.map((item) => {
					return (
						<DropItem key={item.id} onClick={() => selectHandler(item.id)}>
							{item.name}
						</DropItem>
					)
				})}
			</DropContent>
		</DropdownContainer>
	)
}

export default Dropdown
