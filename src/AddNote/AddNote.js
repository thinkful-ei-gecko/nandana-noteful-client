import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';
import config from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleButton from '../CircleButton/CircleButton';

class AddNote extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = ApiContext;

  state = {
    error: null,
    note_name: {
      value: '',
      touched: false,
    },
    content: {
      value: '',
      touched: false,
    },
    folder_id: {
      value: null,
      touched: false,
    },
  };

  handleChangeNoteName = (e) => {
    this.setState({ note_name: { value: e.target.value, touched: true } });
  };

  handleChangeNoteContent = (e) => {
    this.setState({ content: { value: e.target.value, touched: true } });
  };

  handleChangeNoteFolder = (e) => {
    this.setState({ folder_id: { value: Number(e.target.value), touched: true } });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      note_name: this.state.note_name.value,
      content: this.state.content.value,
      folder_id: this.state.folder_id.value,
    };
    this.setState({ error: null });
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return;
      })
      .then(() => {
        this.context.addNote(newNote);
        this.props.history.goBack();
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  validateName() {
    const name = this.state.note_name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    }
  }

  validateContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return 'Content is required';
    }
  }

  validateFolderId() {
    const folder = this.state.folder_id.value;
    if (!folder) {
      return 'Must specify an existing folder';
    }
  }

  render() {
    const { error } = this.state;
    const { folders = [] } = this.context;

    return (
      <section className="AddNote">
        <CircleButton
          tag="button"
          role="link"
          onClick={() => this.props.history.goBack()}
          className="NotePageNav__back-button"
        >
          <FontAwesomeIcon icon="chevron-left" />
          <br />
          Back
        </CircleButton>
        <h2>Add Note</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="noteName">Note Name</label>
          <br />
          <input name="noteName" id="noteName" onChange={this.handleChangeNoteName} />
          {this.state.note_name.touched && (
            <div className="error">{this.validateName()}</div>
          )}
          <br />
          <br />

          <label htmlFor="folderid">Folder ID</label>
          <br />
          <select name="folderid" id="folderid" onChange={this.handleChangeNoteFolder}>
            <option value={''}>Select Folder</option>
            {folders.map((folder, index) => {
              return (
                <option value={folder.id} key={index}>
                  {folder.folder_name}
                </option>
              );
            })}
          </select>
          {this.state.folder_id.touched && (
            <div className="error">{this.validateFolderId()}</div>
          )}
          <br />
          <br />

          <label htmlFor="noteContent">Content</label>
          <br />
          <textarea
            name="noteContent"
            id="noteContent"
            onChange={this.handleChangeNoteContent}
          />
          {this.state.content.touched && (
            <div className="error">{this.validateContent()}</div>
          )}
          <br />
          <br />

          <button
            type="submit"
            disabled={
              this.validateName() || this.validateFolderId() || this.validateContent()
            }
          >
            Add Note
          </button>
        </form>
      </section>
    );
  }
}

export default AddNote;