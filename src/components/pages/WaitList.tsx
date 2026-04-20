import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useNavigate } from "react-router";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "react-international-phone/style.css";
import { useMutation } from "@tanstack/react-query";
import waitList, { type WaitListData } from "@/services";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
	message: string;
}

const USER_TYPE = [
	{ label: "Earn by Running Errands", value: "earn" },
	{ label: "Get Help with my Errands", value: "get_help" },
];

const WaitListSchema = z.object({
	fullName: z.string().min(2, "Full name is required"),
	phoneNumber: z.string().regex(/^\+\d{10,15}$/, "Enter a valid phone number"),
	email: z.email("Enter a valid email"),
	userType: z
		.string()
		.nonempty("Plan to use ErrandGo for is required")
		.refine((val) => ["earn", "get_help"].includes(val), {
			message: "Invalid selection",
		}),
});

type WaitListFormData = z.infer<typeof WaitListSchema>;

function WaitList() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm({
		resolver: zodResolver(WaitListSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phoneNumber: "",
			userType: "",
		},
	});

	const { mutate: waitListMutation, isPending: waitListPending } = useMutation({
		mutationFn: (data: WaitListData) => waitList(data),
		onSuccess: async (data) => {
			if (data.statusText === "OK") {
				reset();
				toast.success("Details Submitted successfully");
			} else {
				toast.error("Something went wrong");
			}
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			console.error("Error:", error);
			const message = error.response?.data?.message || "Something went wrong";

			toast.error(message);
		},
	});

	const onSubmit = (data: WaitListFormData) => {
		waitListMutation(data);
	};

	return (
		<div className="pt-[150px] lg:pt-[200px] bg-white px-4 min-h-screen pb-[150px]">
			<div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn space-y-5">
				<button
					onClick={() => navigate(-1)}
					className="flex cursor-pointer items-center gap-2"
				>
					<IoIosArrowDropleftCircle className="text-[32px] text-[#6B7280]" />
					<span className="text-[18px] text-[#4B5563]">Back</span>
				</button>

				<div className="scrollbar-hidden max-h-[calc(100vh-100px)] pt-10 md:pt-[55px] pb-10 md:pb-[55px] px-6 md:px-12 overflow-scroll w-full bg-[#F8F3FF] sm:max-w-[1120px] rounded-3xl">
					<h2 className="text-left text-[#00072D] font-bold text-[20px] sm:text-[50px]">
						Join Waitlist
					</h2>
					<p className="text-[#383C45] font-urbanist text-left font-normal sm:text-[24px]">
						Save a spot and get notified about ErrandGo updates
					</p>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="grid mt-8 rounded-xl gap-6 grid-cols-1 md:gap-8 md:grid-cols-2 bg-white pt-10 px-6 md:pt-[55px] pb-10 md:pb-[55px] md:px-12"
					>
						<CustomInput
							label="Full Name"
							placeholder="Enter Name"
							type="text"
							error={errors.fullName?.message}
							{...register("fullName")}
							className="w-full"
							disabled={waitListPending}
						/>

						<CustomInput
							label="Email Address"
							placeholder="joe@gmail.com"
							type="text"
							error={errors.email?.message}
							{...register("email")}
							disabled={waitListPending}
							className="w-full"
						/>

						<div className="flex flex-col gap-1 text-sm">
							<label className="block font-light text-[#3F3E3E]">
								Phone Number
							</label>
							<Controller
								name="phoneNumber"
								control={control}
								render={({ field }) => (
									<PhoneInput
										defaultCountry="ng"
										value={field.value}
										onChange={field.onChange}
										inputStyle={{
											borderTopRightRadius: "12px",
											borderBottomRightRadius: "12px",
											fontSize: "14px",
											height: "56px",
											width: "100%",
											background: waitListPending ? "#d1d5dc" : "#F7F9FD",
											border: "none",
											cursor: waitListPending ? "not-allowed" : "text",
										}}
										disabled={waitListPending}
										countrySelectorStyleProps={{
											buttonStyle: {
												borderTopLeftRadius: "12px",
												borderBottomLeftRadius: "12px",
												height: "56px",
												width: "78px",
												border: "none",
												background: waitListPending ? "#d1d5dc" : "#F7F9FD",
												marginRight: "2px",
											},
										}}
									/>
								)}
							/>

							{errors.phoneNumber && (
								<span className="text-xs font-light text-red-500">
									{errors.phoneNumber.message}
								</span>
							)}
						</div>

						<CustomSelect
							label="How do you plan to use ErrandGo?"
							placeholder="Select"
							options={USER_TYPE}
							error={errors.userType?.message}
							register={register("userType")}
							disabled={waitListPending}
						/>

						<div></div>

						<button
							disabled={waitListPending}
							className="bg-[#7D32DF] disabled:bg-[#7D32DF]/70 disabled:cursor-not-allowed  w-full order-2 text-white cursor-pointer py-4 px-2 rounded-[360px]"
							type="submit"
						>
							{waitListPending ? "Submitting..." : "Submit"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default WaitList;
