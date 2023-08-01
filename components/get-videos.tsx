export {}
// export default function GetVideos() {
//   const [videos, setVideos] = useState<Video[]>([])
//   const [videoData, setVideosData] = useState<VideoData>({
//     adding_media: [],
//     added_media: [],
//   })

//   async function getVideos(q: string): Promise<void> {
//     const query = q
//     if (query === "") {
//       setVideos([])
//       return
//     }
//     try {
//       await client.videos.search({ query, per_page: 20 }).then((res: any) => {
//         const videos = res.videos
//         if (!videos) {
//           setVideos([])
//         } else {
//           setVideos(videos)
//         }
//       })
//     } catch (e: any) {
//       console.log(e)
//     }
//   }

//   return
// (
//   <Header>
//               <Input
//                 placeholder="Search free high-resolution videos"
//                 onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
//                   getVideos(event.currentTarget.value)
//                 }
//               />
//             </Header>
//             <div>
//               {videos && (
//                 <div className="mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6">
//                   {videos.map((video: Video) => {
//                     return (
//                       <div key={video.id} className="relative w-full">
//                         <PhotoOutput src={video.image!} url={video.url}>
//                           {getButton(video)}
//                         </PhotoOutput>
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}

//               {videos.length === 0 && <EmptyState />}
//               {error && <NoResultState />}
//             </div>
// )
// }
