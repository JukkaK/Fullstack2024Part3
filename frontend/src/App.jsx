import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonsForm from './components/PersonsForm'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('');
  const [updateMessage, setUpdateMessage] = useState('something was updated...')

  useEffect(() => {
    console.log('effect')
    personService
    .getAll()
    .then(InitialPersons => {
      setPersons(InitialPersons)
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const setNotification = (message) => {
    setUpdateMessage(message);
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
      });
    }
    setUpdateMessage(`Deleted ${person.name}`)

    setTimeout(() => {
      setNotification(null);
    }, 2000);
  }

  const addName = (event) => {
    event.preventDefault()    
    const personNameObject = {
      id: persons.length > 0 ? persons[persons.length - 1].id + 1 : 1,
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(p => p.name === newName);

      if (existingPerson) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          personService
            .update(existingPerson.id, personNameObject)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            });
        }
      } else {
        personService
          .create(personNameObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
          })
        setUpdateMessage(`Added ${newName}`)
      }

    setTimeout(() => {
      setNotification(null);
    }, 2000);

    setNewName('');
    setNewNumber('');
    }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  }

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()));

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='notification'>
        {message}
      </div>
    )

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={updateMessage} />
      <Filter value={nameFilter} onChange={handleNameFilterChange} />
      
      <PersonsForm 
        onSubmit={addName} 
        name={newName} 
        handleNameChange={handleNameChange} 
        number={newNumber} 
        handleNumberChange={handleNumberChange} 
      /> 
      <h2>Numbers</h2>      
      <ul>
        {namesToShow.map(person =>
          <Persons key={person.id} person={person} deletePerson={deletePerson} />
        )}
      </ul>       
    </div>
  )
}

export default App

