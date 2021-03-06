import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class Projects extends Component {
  render () {
    const {
      projects,
      tab,
      changeTab
    } = this.props;

    const classNames = {
      tab: (index) => (
        (tab === index) ? 'selected-tab' : 
        (index < tab)   ? 'left-tab' : 
        (index > tab)   ? 'right-tab' : ''
      )
    };

    const tabList = projects.map((e, i) => (
      <li key={e.id} className={ classNames.tab(i) } onClick={() => changeTab(i)}>
        <div><i className="icon-times"></i></div>{ e.name }
      </li>
    ));

    const content = projects.length ? projects[tab].children : 'NO CONTENT';

    return (
      <div className="projects">
        { projects.length > 0 && 
        <nav>
          <ul className="tabs">{ tabList }</ul>
          <div>
            <div className="double-angle-btn"><i className="icon-angle-double-right"></i></div>
          </div>
        </nav> }
        <div className="container">
          { content }
        </div>
      </div>
    );
  }
}

// Projects.propTypes = {
//   projects: PropTypes.array.isRequired
//   tab: PropTypes.number.isRequired
//   changeTab: PropTypes.func.isRequired
// }

export default Projects;