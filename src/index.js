import React from "react";
import ReactDOM from "react-dom";
import Tabletop from "tabletop";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

var publicSpreadsheetUrl =
  "https://docs.google.com/spreadsheets/d/1___fIV5Y2UdLvkaeYR7sdgIp_kyQ2-yjb9IzpvXVw2E/edit?usp=sharing";

class QuestionBox extends React.Component {
  render() {
    return (
      <div>
        <button type="button" onClick={this.props.onClick}>
          Next question
        </button>
        <p>{this.props.currentQuestion}</p>
        <button type="button" onClick={this.props.onAnswerReq}>
          Show Answer
        </button>
        <p>{this.props.currentAnswer}</p>
      </div>
    );
  }
}


class TheoryBox extends React.Component{
  
  render(){

    const styling = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden'
      },
      gridList: {
        width: 500,
        height: 450
      },
    }

    const theoryData = this.props.theoryData;

    return (
      <div style ={styling.root}>
        <GridList cellHeight={160} style={styling.gridList} cols={3}>
          {theoryData.map(function(tcard){
              return(
              <GridListTile key={tcard.key} cols={tcard.cols || 1}>
              <h1>hello</h1>
              </GridListTile>
            );
          })}
        </GridList>
      </div>
    );
  }
}

class ParentWithData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      v0_woorden: [],
      v1_vormleer: [],
      v5_theorie: [],
      questionCounter: 0,
      currentQuestion: "",
      currentAnswer: "",
      answerVisible: false,
      shownAnswer: ""
    };
    this.nextQ = this.nextQ.bind(this);
    this.showA = this.showA.bind(this);
  }

  componentDidMount() {
    Tabletop.init({
      key: publicSpreadsheetUrl,
      callback: (data, tabletop) => {
        //console.log('tabletop0 --->', tabletop.sheets("v0_woorden").all()[questionCounter].nederlands);
        this.setState({
          data: data,
          v0_woorden: tabletop.sheets("v0_woorden").all(),
          v1_vormleer: tabletop.sheets("v1_vormleer").all(),
          v5_theorie: tabletop.sheets("v5_theorie").all()
        });
        return null;
      },
      simpleSheet: false
    });
  }

  nextQ() {
    const intCounter = this.state.questionCounter + 1;
    const questionRow = this.state.v0_woorden[intCounter];
    this.setState({
      questionCounter: intCounter,
      currentQuestion: questionRow.nederlands,
      currentAnswer: questionRow.duits,
      answerVisible: false,
      shownAnswer: ""
    });
  }

  showA() {
    this.setState({
      answerVisible: true,
      shownAnswer: this.state.currentAnswer
    });
  }

  render() {
    console.log(this.state.v5_theorie);

    const htmlarray = this.state.v5_theorie.map(function(rowEl) {
      const gridClassName = "grid-item grid-item--" + rowEl.gridclass;
      return (
        <div class={gridClassName}>
          <h1>{rowEl.theoryclass}</h1>
          <h2>{rowEl.titel}</h2>
          <p>{rowEl.text}</p>
        </div>
      );
    });

    const htmlarraycols = [
      <div class="grid-col grid-col--1" />,
      <div class="grid-col grid-col--2" />,
      <div class="grid-col grid-col--3" />,
      <div class="grid-col grid-col--4" />
    ];

    const fullhtmlarray = [...htmlarraycols, ...htmlarray];

    console.log("htmlarray --->", htmlarray);
    console.log("htmlarraycols --->", htmlarraycols);

    console.log("fullhtmlarray --->", fullhtmlarray);

    console.log("gridlayout --->", <div class="grid">{fullhtmlarray}</div>);
    //const object3 = {...htmlarraycols, ...htmlarray}

    //const = finalarray = htmlarraycols.concat(htmlarray);
    //console.log('htmlarraycols --->', htmlarraycols.concat(htmlarray)]);

    //     console.log(items);
    //const items =this.state.toDoList.map((item) => <li>{item}</li>);

    return (
      <div>
        <div>
          <QuestionBox
            onClick={this.nextQ}
            onAnswerReq={this.showA}
            currentAnswer={this.state.shownAnswer}
            currentQuestion={this.state.currentQuestion}
          />
        </div>
        <div className ="grid">{fullhtmlarray}</div>
        <TheoryBox theoryData = {this.state.v5_theorie}/>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<ParentWithData />, rootElement);
