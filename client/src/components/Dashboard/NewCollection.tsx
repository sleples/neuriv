import './NewCollection.scss';
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field, InjectedFormProps } from 'redux-form';
import Header from '../Header';
import axios from 'axios';
import TextareaAutosize from 'react-autosize-textarea';
import { RouteComponentProps } from 'react-router-dom';
import shortid from 'shortid';
import QuestionForm from './Forms/QuestionForm';
import { QUESAPI_PATH, DASHBOARD_PATH } from '../../config';
import CollectionForm from './Forms/CollectionForm';

type StateProps = {
  auth: Types.UserState;
};

interface ComponentState {
  questions: Types.Questions;
}

class NewCollection extends PureComponent<
  StateProps & RouteComponentProps & InjectedFormProps,
  ComponentState
> {
  state: ComponentState = {
    questions: {}
  };

  questionChange = (event: React.FormEvent<any>) => {
    const id = event.currentTarget.getAttribute('id');
    const elem = event.target as HTMLInputElement;
    this.setState((prevState: any) => {
      return {
        questions: {
          ...prevState.questions,
          [id]: {
            question: elem.value,
            answer: prevState.questions[id].answer
          }
        }
      };
    });
  };

  answerChange = (event: React.FormEvent<any>) => {
    const id = event.currentTarget.getAttribute('id');
    const elem = event.target as HTMLInputElement;
    this.setState((prevState: ComponentState) => {
      return {
        questions: {
          ...prevState.questions,
          [id]: {
            question: prevState.questions[id].question,
            answer: elem.value
          }
        }
      };
    });
  };

  renderQuestions = () => {
    const qArr: Array<JSX.Element> = [];
    Object.keys(this.state.questions).forEach(id => {
      qArr.push(
        <div key={id}>
          <TextareaAutosize
            id={id}
            className="input panel-block"
            value={this.state.questions[id].question}
            onChange={this.questionChange}
          />
          <TextareaAutosize
            id={id}
            className="input panel-block"
            value={this.state.questions[id].answer}
            onChange={this.answerChange}
          />
          <button
            id={id}
            onClick={this.removeQuestion}
            className="button is-dark is-medium"
          >
            Delete
          </button>
        </div>
      );
    });
    return qArr;
  };

    createCollection = async ({ title }: Types.NewCollection) => {
    if (this.props.auth) {
      await axios.post(QUESAPI_PATH + this.props.auth.id, {
        title,
        questions: Object.values(this.state.questions)
      });
      this.props.history.push(DASHBOARD_PATH);
    }
  };


  addQuestion = ({ question, answer }: Types.FormQuestion) => {
    const id = shortid.generate();
    this.setState(prevState => {
      return {
        questions: {
          ...prevState.questions,
          [id]: { question, answer }
        }
      };
    });
  };

  removeQuestion = (event: React.FormEvent<any>) => {
    const id = event.currentTarget.getAttribute('id');
    const { [id]: q, ...qState } = this.state.questions;
    this.setState(() => {
      return {
        questions: qState
      };
    });
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <h1>Create a new collection</h1>
          <CollectionForm
            submitAction={this.createCollection}
            renderJSX={this.renderQuestions()}
          />
          <QuestionForm submitAction={this.addQuestion} />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }: Types.State): Types.AuthState {
  return { auth };
}

export default compose(
  connect(mapStateToProps),
  reduxForm({ form: 'createcollection' })
)(NewCollection);
