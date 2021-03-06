'use strict';

import React, { Component } from 'react';

import {Switch, Linking} from 'react-native';

import {Text, Content, Container, Picker, View, Button, Card, CardItem} from 'native-base';

import styles from './styles';
import recommendations from '../../recommendation-page/recommendation-card/recommendations.js';
import Collapsible from 'react-native-collapsible';
import ReminderEditor from './reminder-editor';

import LastTestDatePicker from './last-test-date-picker';

const Item = Picker.Item;

class RemindersCard extends Component {
    constructor(props) {
      super(props)
      console.log('this.props.testFrequency: ', this.props.testFrequency);
      this.state = {
        editingMode: false,
        testFrequency: this.props.testFrequency,
      }
    }

    toggleEditingMode() {
      this.setState({
        editingMode: !this.state.editingMode,
      })
    }

    openLink(url) {
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    setTestFrequency(frequency) {
      this.props.setTestFrequency(frequency)
      this.setState({
        testFrequency: frequency,
      })
    }

    render() {
      const {editingMode} = this.state
      const {text, reminderText, setReminders, orderHomeKit} = recommendations[this.props.recommendationCode]

      return (
        <View style={{marginTop: 20}}>
          <View style={styles.cardHeader}>
            <Text style={styles.headerText}>{this.props.label} TESTING REMINDER</Text>
          </View>
          { editingMode ?
            <View>
              <View padder style={styles.card}>
                <Text style={styles.title}>
                  Doctor D has set a reminder for you to get an HIV test every 3-6 months, since many guys should get tested every 3-6 months.{"\n"}
                </Text>

                <Text style={styles.title}>
                Ask your doctor if you have any questions about how often you should get a test. Talk to your doctor immediately if you have had a <Text style={[styles.title, {fontWeight: 'bold'}]}>high-risk exposure</Text> to HIV.
                </Text>

                { setReminders &&
                  <View style={styles.reminderContainer}>
                    <Text style={styles.reminderLabel}>TURN {this.props.reminder ? 'OFF' : 'ON'} REMINDERS:</Text>
                    <Switch style={styles.reminderSwitch}
                      onValueChange={() => this.props.toggleReminder()}
                      value={this.props.reminder}
                    />
                  </View>
                }

                <Collapsible collapsed={!this.props.reminder}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.reminderLabel,{marginTop: 8, marginRight: -30}]}>PICK FREQUENCY: </Text>
                    <Picker
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={this.state.testFrequency}
                        onValueChange={this.setTestFrequency.bind(this)}
                        >
                        <Item label="Every 3 months" value="3months" />
                        <Item label="Every 6 months" value="6months" />
                        <Item label="Every 9 months" value="9months" />
                     </Picker>
                   </View>

                  <ReminderEditor modal={this.props.nextModal} date={this.props.nextDate}/>
                </Collapsible>

                <LastTestDatePicker modal={this.props.lastModal} date={this.props.lastDate}/>

              </View>

              <Button style={styles.saveButton} textStyle={{color: 'white', fontSize: 15}} onPress={this.toggleEditingMode.bind(this)}>SAVE REMINDER</Button>
            </View>
          : <View>
              <View padder style={styles.card}>
                <Text style={styles.title}>{reminderText}</Text>

                <Text style={{fontSize: 14, color: 'red', fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>NEXT REMINDER: {this.props.reminder ? this.props.nextDate.toString().substr(4,12).toUpperCase() : 'No reminder set.'}</Text>

                <Text style={{fontSize: 14, color: 'red', fontWeight: 'bold', marginBottom: 10}}>MY LAST {this.props.label} TEST WAS ON: { this.props.lastDate ? this.props.lastDate.toString().substr(4,12).toUpperCase() : 'Not Sure.'}</Text>

              </View>
              <Button style={[styles.saveButton, {backgroundColor: '#5f9ea0'}]} textStyle={{color: 'white', fontSize: 14}} onPress={this.toggleEditingMode.bind(this)}>MANAGE</Button>
            </View>}

        </View>
      )
    }
}

export default RemindersCard;
