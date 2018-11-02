import React, { Component } from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { range, compose } from 'ramda'

import DefaultContainer from 'components/default-container'
import Content from 'components/content'
import Text from 'components/text'
import Spacer from 'components/spacer'
import Button from 'components/button'
import { colors } from 'components/variables'

import ListItem from './bet-list-item'
import * as queries from './queries'
import { trackEvent, events } from '../../tracking'
import { TranslatorConsumer } from '../../translations'
import withNavigate from '../../navigation/withNavigate'
import withIsLoggedIn from '../../user/auth/withIsLoggedIn'

const Root = styled.div`
  min-height: 100%;
`

const ListWrapper = styled.div`
  border-top: 1px solid ${colors.grey3};
`

class BetList extends Component {
  constructor (props) {
    super(props)

    this.renderItems = this.renderItems.bind(this)
  }

  componentDidMount () {
    trackEvent(events.pageLoaded, { page: 'betList' })
  }

  renderPlaceholderItems (n) {
    return range(0, n).map(i => {
      return <ListItem key={i} placeholder />
    })
  }

  renderEmptyState () {
    return (
      <div>
        <Content type='subtitle' fontWeight='regular'>
          Create your first bet
        </Content>
        <Spacer bottom={1} />
        <Content type='body'>Your bets will appear in this list</Content>
        <Spacer bottom={3} />
        <Button type='level2' onClick={() => this.props.goToPage(`/bets/new`)}>
          {'Make a bet'}
        </Button>
      </div>
    )
  }

  renderItems (bets) {
    return bets.map(bet => {
      return (
        <ListItem
          key={bet.id}
          id={bet.id}
          bet={bet}
          currentUser={this.props.data.currentUser}
          onClick={() => this.props.goToPage(`/bet/${bet.id}`)}
        />
      )
    })
  }

  render () {
    const { loading, bets, currentUser } = this.props.data

    if (!currentUser) return null

    let items = []
    if (loading) {
      items = this.renderPlaceholderItems(2)
    } else {
      items = this.renderItems(bets)
    }

    return (
      <Root>
        <DefaultContainer>
          <Spacer inner top={3} />
          <TranslatorConsumer>
            {t => (
              <Text size='size3' fontWeight='light'>
                {t('bet-list-page-title')}
              </Text>
            )}
          </TranslatorConsumer>
          <Spacer top={3} />
          <ListWrapper>
            {items.length > 0 ? items : this.renderEmptyState()}
          </ListWrapper>
          <Spacer inner top={3} />
        </DefaultContainer>
      </Root>
    )
  }
}

export default compose(
  graphql(queries.BET_LIST, {
    options: () => ({
      pollInterval: 10000
    })
  }),
  withIsLoggedIn,
  withNavigate
)(BetList)