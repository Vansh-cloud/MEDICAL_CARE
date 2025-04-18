import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';

const APP_ID = 'your-agora-app-id'; // Replace with your Agora App ID

let client: IAgoraRTCClient;
let localVideoTrack: ICameraVideoTrack;
let localAudioTrack: IMicrophoneAudioTrack;

export const initializeVideoCall = async () => {
  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  
  try {
    const uid = await client.join(APP_ID, 'test-channel', null, null);
    
    // Create local audio and video tracks
    [localAudioTrack, localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    
    // Publish local tracks
    await client.publish([localAudioTrack, localVideoTrack]);
    
    return {
      uid,
      videoTrack: localVideoTrack,
      audioTrack: localAudioTrack
    };
  } catch (error) {
    console.error('Error initializing video call:', error);
    throw error;
  }
};

export const leaveCall = async () => {
  try {
    localAudioTrack?.close();
    localVideoTrack?.close();
    await client?.leave();
  } catch (error) {
    console.error('Error leaving call:', error);
  }
};

export const toggleAudio = (enabled: boolean) => {
  if (localAudioTrack) {
    localAudioTrack.setEnabled(enabled);
  }
};

export const toggleVideo = (enabled: boolean) => {
  if (localVideoTrack) {
    localVideoTrack.setEnabled(enabled);
  }
};

export const subscribeToRemoteUser = async (
  user: any, 
  onUserVideoTrack: (track: any) => void
) => {
  await client.subscribe(user, 'video');
  onUserVideoTrack(user.videoTrack);
};

export const onUserJoined = (callback: (user: any) => void) => {
  client?.on('user-published', callback);
};

export const onUserLeft = (callback: (user: any) => void) => {
  client?.on('user-left', callback);
};