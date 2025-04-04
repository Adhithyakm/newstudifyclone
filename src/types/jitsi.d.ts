declare module 'JitsiMeetExternalAPI' {
  interface JitsiMeetExternalAPI {
    new (domain: string, options: any): any;
    dispose: () => void;
    on: (event: string, handler: () => void) => void;
  }
  const JitsiMeetExternalAPI: JitsiMeetExternalAPI;
  export default JitsiMeetExternalAPI;
}