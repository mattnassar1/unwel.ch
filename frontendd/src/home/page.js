import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { compose } from 'ramda'

import { checkTempStatement, checkTempAccept } from './../bet/services'
import * as mutations from './../bet/mutations'

import DefaultContainer from 'components/default-container'
import Spacer from 'components/spacer'
import Link from 'components/link'
import Content from 'components/content'
import Distribute from 'components/distribute'
import { withBreakpoint } from 'components/responsive-provider'
import withNavigate from './../navigation/withNavigate'
import withIsLoggedIn from './../user/auth/withIsLoggedIn'

import Button from 'components/button'
import Logo from 'components/logo'
import styled from 'styled-components'
import { colors } from 'components/variables'

import { trackEvent, events } from '../tracking'
import WaypointAnimate from './waypoint-animate'

import IPHONE_NEW_BET from './assets/iphone-x-new-bet@2x.png'
import IPHONE_WHATSAPP from './assets/iphone-x-whatsapp@2x.png'
import IPHONE_WHO_IS_RIGHT from './assets/iphone-x-who-is-right@2x.png'

const DistributeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & > * {
    flex: 0 0 auto;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

const Hero = styled.div`
  width: 100%;
  background-color: ${colors.grey2};
  padding-top: 16px;
  padding-bottom: 40px;
`

const ConversationWrapper = styled.div`
  display: flex;
  align-items: center;

  flex-direction: ${props => (props.vertical ? 'column' : 'row')};

  > * {
    flex: 1;

    &:not(:last-child) {
      ${props => (props.vertical ? 'margin-bottom:' + props.space * 8 + 'px' : 'margin-right:' + props.space * 8 + 'px')};
    }
  }
`
const Image = styled.img`
  width: 100%;
  min-width: 150px;
  min-height: 260px;
`

const Half = styled.div`
  flex: 1;
`

const Footer = styled.footer`
  width: 100%;
  padding: 32px;
  min-height: 350px;
  position: relative;
  background-color: black;
`

class Home extends Component {
  static propTypes = {
    goToPage: PropTypes.func,
    addBet: PropTypes.func,
    acceptBet: PropTypes.func
  }

  onLogin = () => {
    this.props.goToPage('/login')
  }

  onCreateBet = () => {
    this.props.goToPage('/bets/new')
  }

  componentDidMount () {
    trackEvent(events.pageLoaded, { page: 'landing' })

    if (this.props.isLoggedIn) {
      const statementBet = checkTempStatement()
      const betId = checkTempAccept()
      if (statementBet) {
        this.props.addBet(statementBet.statement, statementBet.bet)
        this.props.goToPage('/bets')
        return
      } else if (betId) {
        this.props.acceptBet(betId)
        trackEvent(events.betAccepted, { betId: betId, beforeLogin: true })
        this.props.goToPage(`/bet/${betId}`)
        return
      }
      this.props.goToPage('/bets')
    }
  }

  render () {
    const { breakpoint } = this.props
    const isBigScreen = breakpoint === 'lg'

    return (
      <div>
        <Hero>
          <DefaultContainer>
            <DistributeWrapper>
              <Logo />
              <Button onClick={this.onLogin} type='inverted' size='small'>
                Log in
              </Button>
            </DistributeWrapper>
            <Spacer top={isBigScreen ? 12 : 8} bottom={3}>
              <Distribute space={1} vertical position='center' align='center'>
                <Spacer bottom={3}>
                  <WaypointAnimate
                    topOffset='0%'
                    direction='down'
                    distance={10}
                  >
                    <Content align='center' type='title' fontWeight='regular'>
                      Friendly betting
                    </Content>
                  </WaypointAnimate>
                </Spacer>
                <WaypointAnimate topOffset='0%' direction='down' distance={10}>
                  <Content align='center' type='heading' fontWeight='regular'>
                    Challenge your friends by betting on anything that you
                    disagree on.
                  </Content>
                  <Spacer top={1}>
                    <Content align='center' type='heading' fontWeight='regular'>
                      Keep track of who's the best.
                    </Content>
                  </Spacer>
                </WaypointAnimate>
              </Distribute>
            </Spacer>
          </DefaultContainer>
        </Hero>

        <Spacer top={-3}>
          <Distribute position='center'>
            <Button
              onClick={this.onCreateBet}
              type='level2'
              size='large'
              dataQa='make-bet-button'
            >
              Make a new Bet
            </Button>
          </Distribute>
        </Spacer>

        <Spacer top={4} bottom={4}>
          <DefaultContainer notPadded={!isBigScreen}>
            <ConversationWrapper
              space={isBigScreen ? 3 : 1}
              vertical={!isBigScreen}
            >
              <Spacer top={3} bottom={5}>
                <Content align='center' type='heading' fontWeight='regular'>
                  Your friends don’t believe in you?
                  <br />
                  <strong>Make them bet a dinner on it!</strong>
                </Content>
              </Spacer>
            </ConversationWrapper>
          </DefaultContainer>
        </Spacer>

        <Spacer top={6} bottom={6}>
          <Spacer bottom={10}>
            <Content align='center' type='title' fontWeight='regular'>
              3 easy steps
            </Content>
          </Spacer>

          <DefaultContainer>
            <Spacer top={isBigScreen ? 15 : 7} bottom={isBigScreen ? 15 : 7}>
              <Distribute space={2} align='center'>
                <Half>
                  <Spacer top={-3}>
                    <WaypointAnimate
                      direction='down'
                      topOffset='90%'
                      distance={10}
                    >
                      <Content
                        type='subtitle'
                        fontWeight='regular'
                        align='right'
                      >
                        Create a bet
                      </Content>
                      <Content
                        type='heading'
                        color={colors.grey8}
                        fontWeight='regular'
                        align='right'
                      >
                        Bet on anything you want. Choose wisely which words to
                        use...
                      </Content>
                    </WaypointAnimate>
                  </Spacer>
                </Half>
                <Half>
                  <WaypointAnimate direction='right' distance={20}>
                    <Spacer
                      top={isBigScreen ? 4 : 0}
                      bottom={isBigScreen ? 4 : 0}
                      left={isBigScreen ? 4 : 0}
                      right={isBigScreen ? 4 : 0}
                    >
                      <Image alt='iPhone X New Bet' src={IPHONE_NEW_BET} />
                    </Spacer>
                  </WaypointAnimate>
                </Half>
              </Distribute>
            </Spacer>
          </DefaultContainer>

          <DefaultContainer>
            <Spacer top={isBigScreen ? 15 : 7} bottom={isBigScreen ? 15 : 7}>
              <Distribute space={2} position='center' align='center'>
                <Half>
                  <WaypointAnimate direction='left' distance={20}>
                    <Spacer
                      top={isBigScreen ? 4 : 0}
                      bottom={isBigScreen ? 4 : 0}
                      left={isBigScreen ? 4 : 0}
                      right={isBigScreen ? 4 : 0}
                    >
                      <Image
                        alt='iPhone X WhatsApp Bet on marathon'
                        src={IPHONE_WHATSAPP}
                      />
                    </Spacer>
                  </WaypointAnimate>
                </Half>
                <Half>
                  <Spacer top={-3}>
                    <WaypointAnimate
                      direction='down'
                      topOffset='90%'
                      distance={10}
                    >
                      <Content
                        type='subtitle'
                        align='left'
                        fontWeight='regular'
                      >
                        Share the bet
                      </Content>
                      <Content
                        type='heading'
                        fontWeight='regular'
                        color={colors.grey8}
                      >
                        So your friend can accept it and become your rival
                      </Content>
                    </WaypointAnimate>
                  </Spacer>
                </Half>
              </Distribute>
            </Spacer>
          </DefaultContainer>

          <DefaultContainer>
            <Spacer top={isBigScreen ? 15 : 7} bottom={isBigScreen ? 15 : 7}>
              <Distribute space={2} position='center' align='center'>
                <Half>
                  <Spacer top={-3}>
                    <WaypointAnimate
                      topOffset='90%'
                      direction='down'
                      distance={10}
                    >
                      <Content
                        type='subtitle'
                        fontWeight='regular'
                        align='right'
                      >
                        Decide who won!
                      </Content>
                      <Content
                        type='heading'
                        fontWeight='regular'
                        align='right'
                        color={colors.grey8}
                      >
                        Try to not lie, otherwise you would have a dicorded bet!
                      </Content>
                    </WaypointAnimate>
                  </Spacer>
                </Half>
                <Half>
                  <WaypointAnimate direction='right' distance={20}>
                    <Spacer
                      top={isBigScreen ? 4 : 0}
                      bottom={isBigScreen ? 4 : 0}
                      left={isBigScreen ? 4 : 0}
                      right={isBigScreen ? 4 : 0}
                    >
                      <Image
                        src={IPHONE_WHO_IS_RIGHT}
                        alt='iPhone X Decide who is right'
                      />
                    </Spacer>
                  </WaypointAnimate>
                </Half>
              </Distribute>
            </Spacer>
          </DefaultContainer>
        </Spacer>

        <Spacer top={6} bottom={6}>
          <Distribute position='center'>
            <Button type='level2'>Create your first bet!</Button>
          </Distribute>
        </Spacer>

        <Footer>
          <DefaultContainer>
            <Content color={colors.grey3}>
              We hate sport's betting online but we love it doing it with a
              friend. We are creating this small Web Application to easy
              manage them.
            </Content>
            <Spacer top={5}>
              <Link color={colors.grey3}>Send us your thoughts</Link>
            </Spacer>
          </DefaultContainer>
        </Footer>
      </div>
    )
  }
}

export default compose(
  graphql(mutations.acceptBet, {
    props: ({ mutate }) => ({
      acceptBet: id => mutate({ variables: { id } })
    })
  }),
  graphql(mutations.addBet, {
    props: ({ mutate }) => ({
      addBet: (statement, quantity) =>
        mutate({ variables: { statement, quantity } })
    })
  }),
  withNavigate,
  withIsLoggedIn,
  withBreakpoint
)(Home)
