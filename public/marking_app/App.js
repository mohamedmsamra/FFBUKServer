class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        alert('clicked');
    }

    render() {
        return (
            <div class="markingSide">
                <div class="sections">
                    <Section title="3 Points Done Well"/>
                    <Section title="3 Points To Impove"/>
                    <Section />
                    <Section />
                </div>
            
                <button onClick={this.handleClick} type="button" class="btn btn-dark">Add Section</button>
            </div>
        );
    }
}