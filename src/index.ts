import { registerPlugin, type RPCCallPayload } from '@pexip/plugin-api'

const plugin = await registerPlugin({
  id: 'video-mute',
  version: 0
})

const muteButtonPayload: RPCCallPayload<'ui:button:add'> = {
  position: 'participantActions',
  label: 'Mute video'
}

const unmuteButtonPayload: RPCCallPayload<'ui:button:add'> = {
  position: 'participantActions',
  label: 'Unmute video'
}

const muteButton = await plugin.ui.addButton(muteButtonPayload)
const unmuteButton = await plugin.ui.addButton(unmuteButtonPayload)

muteButton.onClick.add(async ({ participantUuid }) => {
  await plugin.conference.muteVideo({ muteVideo: true, participantUuid })
})

unmuteButton.onClick.add(async ({ participantUuid }) => {
  await plugin.conference.muteVideo({ muteVideo: false, participantUuid })
})

plugin.events.participants.add(({ participants }) => {
  const mutedParticipants = participants
    .filter((participant) => participant.isCameraMuted)
    .map((participant) => participant.uuid)

  const unmutedParticipants = participants
    .filter((participant) => !participant.isCameraMuted)
    .map((participant) => participant.uuid)

  muteButton
    .update({
      ...muteButtonPayload,
      participantIDs: unmutedParticipants
    })
    .catch(console.error)

  unmuteButton
    .update({
      ...unmuteButtonPayload,
      participantIDs: mutedParticipants
    })
    .catch(console.error)
})
