'use strict';

import React, { Component } from 'react';
import { Image, NativeAppEventEmitter } from 'react-native';
import { connect } from 'react-redux';

import { popRoute, replaceOrPushRoute, pushNewRoute } from '../../actions/route';
import { toggleReminder, setReminderDate, createNewIOSReminder } from '../../actions/recommendations';


import {Container, Header, Title, Content, Text, Button, Icon, InputGroup, Input, View, Footer, Card, CardItem } from 'native-base';

import Modal from 'react-native-modalbox';
import RemindersCard from './reminders-card';

import FooterComponent from './../footer';
import theme from '../../themes/base-theme';
import styles from './styles';
import Calendar from '../calendar';
import RNCalendarReminders from 'react-native-calendar-reminders';

class RemindersPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: null,
        defaultDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
      }
    }

    componentWillMount() {
      this.remindersChangedListener = NativeAppEventEmitter.addListener('remindersChanged', reminders => {
        console.log('remindersChanged', reminders)
      });
      this.reminderSaveSuccessListener = NativeAppEventEmitter.addListener('reminderSaveSuccess', reminderID => {
        console.log('reminderSaveSuccess: ', reminderID)
        if (reminderID !== this.props.recommendations.HIV.ReminderID) {
          this.props.createNewIOSReminder(reminderID, 'HIV');
        }
      });
      this.reminderSaveErrorListener = NativeAppEventEmitter.addListener('reminderSaveError', error => {
        console.log('reminderSaveError: ', error)
      });
    }

    componentWillUnmount() {
      this.remindersChangedListener.remove()
      this.reminderSaveSuccessListener.remove()
      this.reminderSaveErrorListener.remove()
    }

    componentDidMount() {
      // this solves the race condition with this.refs.modal
      this.setState({modal: this.refs.modal})
    }

    popRoute() {
        this.props.popRoute();
    }
    navigateTo(route) {
        this.props.replaceOrPushRoute(route);
    }
    pushNewRoute(route) {
         this.props.pushNewRoute(route);
    }

    closeModal() {
        this.refs.modal.close()
    }

    toggleReminder() {
      RNCalendarReminders.authorizeEventStore((error, auth) => {
        console.log('authorized EventStore');
        if(!this.props.recommendations.HIV.reminderID && this.props.recommendations.HIV.ReminderEnabled && this.props.recommendations.HIV.RecommendationCode) {
          this.setDate(this.state.defaultDate);
        }
      });

      if (this.props.recommendations.HIV.ReminderID && this.props.recommendations.HIV.ReminderEnabled) {
        RNCalendarReminders.removeReminder(this.props.recommendations.HIV.ReminderID);
      }
      this.props.toggleReminder('HIV');
    }

    setDate(date) {
      this.props.setReminderDate(date, 'HIV');

      // check if we have IOS reminder already, if so edit it, if not create new.
      if (this.props.recommendations.HIV.ReminderID) {
        RNCalendarReminders.updateReminder(this.props.recommendations.HIV.ReminderID, {
          startDate: date.toISOString(),
          alarms: [{
            date: date.toISOString()
          }]
        });
      } else {
        RNCalendarReminders.saveReminder('Doctor Dick Reminder', {
          location: '',
          notes: 'Doctor Dick says: Open the App and stay Healthy!',
          startDate: date.toISOString(),
          alarms: [{
            date: date.toISOString()
          }]
        });
      }
    }

    render() {
        const recommendations = this.props.recommendations;
        return (
            <Container theme={theme} style={styles.container} >
                <Image source={require('../../../images/glow2.png')} style={styles.container} >
                    <Header style={styles.header}>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name='ios-arrow-back' style={styles.backButton} />
                        </Button>

                        <Title style={{ color: '#000'}}>My Reminders</Title>
                    </Header>

                    <Content padder>
                        {recommendations.HIV.RecommendationCode &&
                        <View padder>
                            <Text>Based on your questionnaire answers, the CDC recommends:</Text>
                            <RemindersCard
                              label="HIV"
                              recommendationCode={recommendations.HIV.RecommendationCode}
                              reminder={recommendations.HIV.ReminderEnabled}
                              toggleReminder={this.toggleReminder.bind(this)}
                              date={recommendations.HIV.NextReminder || this.state.defaultDate}
                              modal={this.state.modal}
                            />
                        </View>}
                        <Modal
                          style={[styles.modal, styles.modal1]}
                          backdrop={false}
                          ref={'modal'}
                          swipeToClose={true} >
                              <View style={styles.space}>
                                  <Calendar
                                      date={recommendations.HIV.NextReminder || this.state.defaultDate }
                                      setDate={this.setDate.bind(this)}
                                  />
                                  <Text style={{textAlign: 'center'}}>
                                    { this.state.defaultDate.toString().substr(4,12) } is 90 days from today.
                                  </Text>
                                  <Button style={styles.saveButton} rounded onPress={this.closeModal.bind(this)} >
                                      Save
                                  </Button>
                              </View>
                         </Modal>
                    </Content>
                </Image>
                <Footer>
                    <FooterComponent navigator={this.props.navigator} currentPage='remindersPage' />
                </Footer>
            </Container>
        )
    }
}

function mapActionsToProps(dispatch) {
    return {
        popRoute: () => dispatch(popRoute()),
        pushNewRoute: (route) => dispatch(pushNewRoute(route)),
        replaceOrPushRoute: (route) => dispatch(replaceOrPushRoute(route)),
        toggleReminder: (questionnaireType) => dispatch(toggleReminder(questionnaireType)),
        setReminderDate: (date, questionnaireType) => dispatch(setReminderDate(date, questionnaireType)),
        createNewIOSReminder: (reminderID, questionnaireType) => dispatch(createNewIOSReminder(reminderID, questionnaireType)),
    }
}

function mapStateToProps(state) {
  return {
    recommendations: state.recommendations
  }
}

export default connect(mapStateToProps, mapActionsToProps)(RemindersPage);