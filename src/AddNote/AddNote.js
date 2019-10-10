import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';
import PropTypes from 'prop-types';

class AddNote extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
			name: {
				value: '',
			  touched: false
			},
			folderId: {
				value: '',
				touched: false
			},
			content: {
				value: '',
				touched: false
			}
		}
	}

	static contextType = ApiContext;
	
  handleNoteSubmit = (event) => {
		event.preventDefault();

		const newNote = JSON.stringify({
      note_name: this.state.name.value,
      content: this.state.content.value,
      folder_id: this.state.folderId.value,
      
    })

		fetch(`${config.API_ENDPOINT}/notes`,
		{
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: newNote
		})
		.then(res => {
			if (!res.ok)
				return res.json().then(e => Promise.reject(e))
			return res.json()
		})
		.then(response => this.context.addNote(response))
		.then(
			this.props.history.push('/')
		)
		.catch(error => {
			alert(error.message)
		})
	}

  updateFolderId = (folderId) => {
    this.setState({
      folderId: {
				value: folderId,
				touched: true
			}
    })
	}
	
	updateName = (name) => {
		this.setState({
		  name: {
				value: name,
				touched: true
			}
		})
	}

	updateContent = (content) => {
		this.setState({
			content: {
				value: content,
				touched: true
			}
		})
	}

  validateName() {
		const name = this.state.name.value.trim();
		  if (name.length === 0) {
				return 'Name is required'
			}
	}

	validateFolderSelect() {
		const folderIsSelected = this.state.folderId.value;
			return !folderIsSelected;
	}

	render() {
    const folderList = this.context.folders.map (folder => {
      return (
        <option key= {folder.id} value={folder.id}>{folder.folder_name}</option>
      )
    })

     
		return (
			<form onSubmit={this.handleNoteSubmit}>
					<label htmlFor="note-name">Title *</label>
					<input 
						id="note-name" 
						type="text" 
						name="note-name"
						onChange={e => this.updateName(e.target.value)}
					>
					</input>
					{this.state.name.touched && (<ValidationError message = {this.validateName()}/>)}
          <label htmlFor="content">Content</label>
					<textarea id="content" 
						name="content" 
						onChange={e => this.updateContent(e.target.value)}
					></textarea>
					<label htmlFor="folders">Save in *</label>
					<select 
					  id="folders"
					  name="folders"
						onChange={e => this.updateFolderId(e.target.value)}
						defaultValue="Select Folder"
					>
					<option disabled>Select Folder</option>
            {folderList}
          </select>
					<button type="submit"
					disabled = {this.validateName()||this.validateFolderSelect()
				}
					>Save</button>
			</form>
		)
	}
}
export default AddNote;

AddNote.propTypes = {
	folders: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})),
	addNote: PropTypes.func
}