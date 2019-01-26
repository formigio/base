import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Divider from '@material-ui/core/es/Divider/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Style from './Style';
import styles from './Help.css';

type Props = {};

class Help extends Component<Props> {
  props: Props;

  state = {};

  render() {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.settingsContainer}>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>The Accomplishment System</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card className={styles.card}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Pattern - Principles - Tools
                    </Typography>
                    <Typography component="p">
                      The Accomplishment System is based on a pattern of
                      Dreaming, Learning, Planning and Doing. No matter what you
                      are trying to accomplish in your life, there are certain
                      steps that you need to take. The Accomplishment System
                      follows that pattern and facilitates progression towards
                      your dreams, by fostering principles, and providing tools
                      along the way.
                    </Typography>
                    <br />
                    <Divider />
                    <br />
                    <Typography component="p">
                      <b>Formigio Personal</b> is the official application of
                      The Accomplishment System, created by the same people, for
                      the same purpose. Learn a little more about the system
                      here, and feel free to visit www.neverebehind.com to learn
                      even more.
                    </Typography>
                    <br />
                    <Divider />
                    <br />
                    <Typography gutterBottom variant="h5" component="h2">
                      The Accomplishment Pattern
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Dream"
                          secondary="The first step is to dream. Imagine a better something."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Learn"
                          secondary="Then we learn more and more about what it is we desire."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Plan"
                          secondary="As we learn a path becomes clear, we can start to see what it will take to reach our goals."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Do"
                          secondary="Then we must commit and do something about it. Measuring and reviewing our success along the way."
                        />
                      </ListItem>
                    </List>
                    <br />
                    <Typography gutterBottom variant="h5" component="h2">
                      Core Principles
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="If you want things to change, you must do something different." />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Focusing on outcomes will bring better results." />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Commitments are more powerful than assignments." />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Ownership cultivates creativity." />
                      </ListItem>
                    </List>
                    <br />
                    <Typography gutterBottom variant="h5" component="h2">
                      Effective Tools
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Daily Commitments"
                          secondary="The commitments you make towards a Milestone show on your home screen."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Accomplishment Tracker Pages"
                          secondary="Tracker pages are the life blood of accomplishment. They drive everything in Formigio Personal."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Review Cycles"
                          secondary="Setting a review cycle on your trackers is essential. Regular review of your dream ensures that it stays in focus."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Playbooks"
                          secondary="If you do things over and over again, and want to make sure that it's done properly. (Coming soon in Formigio Personal)"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Home Page</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card className={styles.card}>
                  <CardHeader title="Formigio Personal - Home" />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Day Cards"
                          secondary="The home page has a space for each day in the calendar. It can show a few days at a time, so you can plan out when you can work on what."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Daily Commitments"
                          secondary="The commitments you have made show by date. You can complete the commitment, move the commitment to another day, or edit the description."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Focus View"
                          secondary="When a commitment is selected there is a focus view that allows you to see the context of the commitment, including the Milestone and the Tracker. From this view you can save notes to the Milestone and Learning notes back to the Tracker."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Trackers to Review"
                          secondary="Based on the review cycle, the Tracker pages that are ready for review will show on Today's card."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Notes"
                          secondary="The home page has a little sticky note so that you can jot down something quickly. These notes are automatically saved, and are backed up in your user data."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Clock"
                          secondary="The clock on the home page tells the time using your systems timezone."
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Tracker Pages</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card className={styles.card}>
                  <CardHeader title="Formigio Personal - Tracker Pages" />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Tracker Grid"
                          secondary="The Tracker Grid can be accessed from the navigation menu. From the grid, you can search for your Tracker pages by dream text."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Tracker Page"
                          secondary="Tracker pages are laid out according to the Accomplishment Pattern. Allowing you to easily capture the Dream, success statements, learning notes, plans and journal entries."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Review Cycle"
                          secondary="Each Tracker page has a review cycle setting. This tells Formigio Personal how often to prompt you to review the Dream, Success Statements, the Plan and commitment to the next step."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Success Statements"
                          secondary="Imagining the ending from the beginning is crucial to succeeding."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Milestones"
                          secondary="Like the principle states: Focusing on outcomes will bring better results. The plan section has a list of milestones that you can commit to work towards, and mark as reached when the time comes."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Journal"
                          secondary="As you progress toward the dream, progress notes and journal entries can help keep you motivated."
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Data and Privacy</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card className={styles.card}>
                  <CardHeader title="Formigio Personal - Data & Privacy" />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Privacy"
                          secondary="Formigio Personal doesn't transmit any of your data to Never Behind servers at all. All your data is stored on the computer the application is installed on."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Export & Import"
                          secondary="In the Settings page, you can export and import data from the Formigio Personal application."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Offsite Backups and Restore"
                          secondary="As a Formigio Personal user you can have your data backed up to AWS S3 (Amazon Web Services - Simple Storage). There is no cost to do so from Never Behind, but AWS charges do apply."
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Contact Us</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card className={styles.card}>
                  <CardHeader title="If you need help, let us know." />
                  <CardContent>
                    <Typography component="p">
                      We are offering the Formigio Base app as a starting point
                      for your business application development. Please let us
                      know if you have any feedback.
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Geoff Douglas"
                          secondary="geoff@neverbehind.com"
                        />
                        <ListItemText
                          primary="Peter Douglas"
                          secondary="peter@neverbehind.com"
                        />
                        <ListItemText
                          primary="Ben Davis"
                          secondary="ben.davis@neverbehind.com"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
      </div>
    );
  }
}

Help.defaultProps = {};

Help.propTypes = {};

export default withStyles(Style)(Help);
