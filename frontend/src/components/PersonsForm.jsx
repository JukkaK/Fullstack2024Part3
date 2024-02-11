const PersonsForm = ({ onSubmit, name, handleNameChange, number, handleNumberChange }) => {
    return (
      <form onSubmit={onSubmit}>
        name: <input value={name} onChange={handleNameChange} /><br/>
        number: <input value={number} onChange={handleNumberChange} />
        <button type="submit">save</button>
      </form>   
    )
  }

  export default PersonsForm