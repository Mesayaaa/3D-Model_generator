export async function submitRodinJob(formData: FormData) {
  const response = await fetch("/api/rodin", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to submit job")
  }

  return response.json()
}

export async function checkJobStatus(subscriptionKey: string) {
  const response = await fetch(`/api/status?subscription_key=${subscriptionKey}`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to check status")
  }

  return response.json()
}

export async function downloadModel(taskUuid: string) {
  const response = await fetch(`/api/download?task_uuid=${taskUuid}`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to get download info")
  }

  return response.json()
}
