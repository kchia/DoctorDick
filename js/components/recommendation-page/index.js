'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';

import { popRoute } from '../../actions/route';

import {Container, Header, Title, Content, Text, Button, Icon, InputGroup, Input, View } from 'native-base';

import theme from '../../themes/base-theme';
import styles from './styles';

class RecommendationPage extends Component {

    popRoute() {
        this.props.popRoute();
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor:'#384850'}}>
                <Image source={require('../../../images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Recommendations</Title>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View padder>
                            <Button rounded block style={{backgroundColor: '#fff', marginTop: 20}} textStyle={{color: '#00c497'}}>
                                Find Test Centers
                            </Button>
                            <Button rounded block style={{backgroundColor: '#fff', marginTop: 20}} textStyle={{color: '#00c497'}}>
                                Set Reminders
                            </Button>
                        </View>
                    </Content>
                </Image>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindAction)(RecommendationPage);