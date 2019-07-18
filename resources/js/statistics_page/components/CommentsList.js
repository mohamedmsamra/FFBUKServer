import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListOption from './ListOption';

class CommentsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOptions: {
                orderBySection: false,
                orderByType: false,
                showPrivate: false
            }
        }
    }

    handleListOptionChange(option) {
        this.setState(prevState => {
            const listOptions = prevState.listOptions;
            switch (option) {
                case 'section':
                    listOptions.orderBySection = !listOptions.orderBySection;
                    break;
                case 'type':
                    listOptions.orderByType = !listOptions.orderByType;
                    break;
                case 'privComments':
                    listOptions.showPrivate = !listOptions.showPrivate;
                    break;
            }
            return prevState;
        });
    }

    render() {
        // const separateByType = (cs) => {
        //     const positive = cs.filter(c => c.type == 'positive');
        //     const negative = cs.filter(c => c.type == 'negative');
        //     return [positive, negative];
        // }

        const recursiveSortByType = cs => {
            if (Array.isArray(cs[0])) return cs.map(c => recursiveSortByType(c));
            return [cs.filter(c => c.type == 'positive'), cs.filter(c => c.type == 'negative')];
        }

        const recursiveSortByCount = cs => {
            if (Array.isArray(cs[0])) return cs.map(c => recursiveSortByCount(c));
            return cs.sort((a, b) => (b.count - a.count))
        }

        const fragmentArrayBySection = cs => {
            // Assumes a sorted array
            const fragmentedArray = [];
            let currentSection = [];
            for (var i = 0; i < cs.length; i++) {
                if (i == 0) currentSection.push(cs[i]);
                else if (currentSection[0].section.id == cs[i].section.id) currentSection.push(cs[i]);
                else {
                    fragmentedArray.push(currentSection);
                    currentSection = [cs[i]];
                }
            }
            return fragmentedArray.concat([currentSection]);
        }

        const recursiveSortBySection = cs => {
            if (Array.isArray(cs[0])) return cs.map(c => recursiveSortBySection(c));
            return fragmentArrayBySection(cs.sort((a, b) => (a.section.id - b.section.id)));
        }

        const traverse = cs => {
            if (Array.isArray(cs[0])) return cs.reduce((a, b) => a.concat(traverse(b)), []);
            return cs;
        }

        const commentsList = [this.props.comments]
        .map(this.state.listOptions.orderByType ? recursiveSortByType : cs => cs)
        .map(this.state.listOptions.orderBySection ? recursiveSortBySection : cs => cs)
        .map(recursiveSortByCount)
        .map(traverse)[0]
        .filter(this.state.listOptions.showPrivate ? () => true : c => c.private == false)
        .map(comment => (
            <ListGroup.Item key={comment.id} className={`sectionComment ${comment.type} ${comment.private ? 'privateComment' : 'publicComment'}`}>
                <span className="comment-count">{`(${comment.count}) `}</span>
                {comment.text}
                <span className="section-name">{comment.section.title}</span>
            </ListGroup.Item>
        ));
        

        return (
            <div className="commentsList">
                <ListOption id='listOptionSection' text='Order by section' value={this.state.listOptions.orderBySection} onChange={() => {this.handleListOptionChange('section')}} />
                <ListOption id='listOptionType' text='Order by type' value={this.state.listOptions.orderByType} onChange={() => {this.handleListOptionChange('type')}} />
                <ListOption id='listOptionPrivComments' text='Show private comments' value={this.state.listOptions.showPrivate} onChange={() => {this.handleListOptionChange('privComments')}} />
                <ListGroup>
                    {commentsList}
                </ListGroup>
            </div> 
        );
    }
}

export default CommentsList;